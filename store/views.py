from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Q
from django.utils.http import url_has_allowed_host_and_scheme

from .models import Product, Category, Cart, CartItem, ComboDiscount, Order, OrderItem
from .forms import CheckoutForm


def get_or_create_cart(request):
    if not request.session.session_key:
        request.session.create()
    cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart


def home(request):
    featured_products = Product.objects.filter(is_active=True, stock__gt=0)[:8]
    categories = Category.objects.all()
    combo_discounts = ComboDiscount.objects.all()
    return render(request, 'store/home.html', {
        'featured_products': featured_products,
        'categories': categories,
        'combo_discounts': combo_discounts,
    })


def product_list(request):
    products = Product.objects.filter(is_active=True)
    categories = Category.objects.all()
    category_slug = request.GET.get('category')
    search_query = request.GET.get('q', '').strip()
    selected_category = None

    if category_slug:
        selected_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=selected_category)

    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )

    return render(request, 'store/product_list.html', {
        'products': products,
        'categories': categories,
        'selected_category': selected_category,
        'search_query': search_query,
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    related = Product.objects.filter(category=product.category, is_active=True).exclude(pk=product.pk)[:4]
    return render(request, 'store/product_detail.html', {
        'product': product,
        'related_products': related,
    })


def combo_builder(request):
    """Page where users build a custom combo and see the discount."""
    products = Product.objects.filter(is_active=True, stock__gt=0).select_related('category')
    categories = Category.objects.all()
    combo_discounts = ComboDiscount.objects.all()
    return render(request, 'store/combo_builder.html', {
        'products': products,
        'categories': categories,
        'combo_discounts': combo_discounts,
    })


def cart_detail(request):
    cart = get_or_create_cart(request)
    subtotal = cart.get_subtotal()
    discount_amount, discount_rule = cart.get_combo_discount_amount()
    total = cart.get_total()
    next_discount = None
    next_rule = ComboDiscount.objects.filter(
        min_items__gt=cart.get_item_count()
    ).order_by('min_items').first()
    if next_rule:
        items_needed = next_rule.min_items - cart.get_item_count()
        next_discount = {'rule': next_rule, 'items_needed': items_needed}

    return render(request, 'store/cart.html', {
        'cart': cart,
        'subtotal': subtotal,
        'discount_amount': discount_amount,
        'discount_rule': discount_rule,
        'total': total,
        'next_discount': next_discount,
    })


def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id, is_active=True)
    cart = get_or_create_cart(request)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    messages.success(request, f'"{product.name}" added to your cart.')
    next_url = request.POST.get('next') or request.GET.get('next') or ''
    if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
        return redirect(next_url)
    return redirect('cart_detail')


def remove_from_cart(request, item_id):
    cart = get_or_create_cart(request)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart)
    item.delete()
    messages.success(request, 'Item removed from cart.')
    return redirect('cart_detail')


def update_cart(request, item_id):
    if request.method == 'POST':
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, pk=item_id, cart=cart)
        qty = int(request.POST.get('quantity', 1))
        if qty < 1:
            item.delete()
        else:
            item.quantity = qty
            item.save()
    return redirect('cart_detail')


def checkout(request):
    cart = get_or_create_cart(request)
    if not cart.items.exists():
        messages.warning(request, 'Your cart is empty.')
        return redirect('cart_detail')

    subtotal = cart.get_subtotal()
    discount_amount, discount_rule = cart.get_combo_discount_amount()
    total = cart.get_total()

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            order = Order.objects.create(
                session_key=request.session.session_key,
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email'],
                address=form.cleaned_data['address'],
                city=form.cleaned_data['city'],
                postal_code=form.cleaned_data['postal_code'],
                subtotal=subtotal,
                discount_amount=discount_amount,
                total=total,
            )
            for item in cart.get_items():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    price=item.product.price,
                    quantity=item.quantity,
                )
            cart.items.all().delete()
            return redirect('order_success', order_id=order.pk)
    else:
        form = CheckoutForm()

    return render(request, 'store/checkout.html', {
        'form': form,
        'cart': cart,
        'subtotal': subtotal,
        'discount_amount': discount_amount,
        'discount_rule': discount_rule,
        'total': total,
    })


def order_success(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    return render(request, 'store/order_success.html', {'order': order})
