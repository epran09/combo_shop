from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from .models import Category, Product, ComboDiscount, Cart, CartItem


class CategoryModelTest(TestCase):
    def test_slug_auto_generated(self):
        cat = Category.objects.create(name='socks')
        self.assertEqual(cat.slug, 'socks')

    def test_str(self):
        cat = Category.objects.create(name='shin_guards')
        self.assertEqual(str(cat), 'Shin Guards')


class ProductModelTest(TestCase):
    def setUp(self):
        self.cat = Category.objects.create(name='socks')

    def test_slug_auto_generated(self):
        product = Product.objects.create(
            category=self.cat, name='Pro Grip Socks', price='9.99', stock=10,
            description='Great socks'
        )
        self.assertEqual(product.slug, 'pro-grip-socks')

    def test_str(self):
        product = Product.objects.create(
            category=self.cat, name='Test Sock', price='5.00', stock=5, description='A sock'
        )
        self.assertEqual(str(product), 'Test Sock')


class ComboDiscountTest(TestCase):
    def setUp(self):
        self.cat = Category.objects.create(name='socks')
        self.cat2 = Category.objects.create(name='gloves')
        ComboDiscount.objects.create(min_items=2, discount_percent=Decimal('5'))
        ComboDiscount.objects.create(min_items=3, discount_percent=Decimal('10'))
        self.p1 = Product.objects.create(
            category=self.cat, name='Sock A', price='10.00', stock=10, description='Sock'
        )
        self.p2 = Product.objects.create(
            category=self.cat2, name='Glove A', price='20.00', stock=10, description='Glove'
        )
        self.p3 = Product.objects.create(
            category=self.cat, name='Sock B', price='15.00', stock=10, description='Sock B'
        )

    def _make_cart(self):
        cart = Cart.objects.create(session_key='test-session-123')
        return cart

    def test_no_discount_single_item(self):
        cart = self._make_cart()
        CartItem.objects.create(cart=cart, product=self.p1, quantity=1)
        amount, rule = cart.get_combo_discount_amount()
        self.assertEqual(amount, 0)
        self.assertIsNone(rule)

    def test_discount_two_items(self):
        cart = self._make_cart()
        CartItem.objects.create(cart=cart, product=self.p1, quantity=1)
        CartItem.objects.create(cart=cart, product=self.p2, quantity=1)
        subtotal = cart.get_subtotal()
        amount, rule = cart.get_combo_discount_amount()
        self.assertEqual(rule.discount_percent, Decimal('5'))
        self.assertAlmostEqual(float(amount), float(subtotal) * 0.05, places=2)

    def test_discount_three_items(self):
        cart = self._make_cart()
        CartItem.objects.create(cart=cart, product=self.p1, quantity=1)
        CartItem.objects.create(cart=cart, product=self.p2, quantity=1)
        CartItem.objects.create(cart=cart, product=self.p3, quantity=1)
        amount, rule = cart.get_combo_discount_amount()
        self.assertEqual(rule.discount_percent, Decimal('10'))

    def test_cart_total_less_than_subtotal_with_discount(self):
        cart = self._make_cart()
        CartItem.objects.create(cart=cart, product=self.p1, quantity=1)
        CartItem.objects.create(cart=cart, product=self.p2, quantity=1)
        self.assertLess(cart.get_total(), cart.get_subtotal())


class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.cat = Category.objects.create(name='socks')
        self.product = Product.objects.create(
            category=self.cat, name='Test Sock', price='8.99', stock=10,
            description='A test sock product'
        )
        ComboDiscount.objects.create(min_items=2, discount_percent=Decimal('5'))

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Combo Shop')

    def test_product_list_view(self):
        response = self.client.get(reverse('product_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Sock')

    def test_product_list_filter_by_category(self):
        response = self.client.get(reverse('product_list') + '?category=socks')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Sock')

    def test_product_detail_view(self):
        response = self.client.get(reverse('product_detail', args=[self.product.slug]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Sock')

    def test_combo_builder_view(self):
        response = self.client.get(reverse('combo_builder'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Combo Builder')

    def test_cart_view_empty(self):
        response = self.client.get(reverse('cart_detail'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'empty')

    def test_add_to_cart(self):
        response = self.client.post(
            reverse('add_to_cart', args=[self.product.pk]),
            {'next': '/cart/'},
        )
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, '/cart/')

    def test_cart_shows_items_after_add(self):
        self.client.post(reverse('add_to_cart', args=[self.product.pk]), {'next': '/cart/'})
        response = self.client.get(reverse('cart_detail'))
        self.assertContains(response, 'Test Sock')

    def test_search_products(self):
        response = self.client.get(reverse('product_list') + '?q=sock')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Sock')
