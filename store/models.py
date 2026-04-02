from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    ALLOWED_CATEGORIES = [
        ('socks', 'Socks'),
        ('shin_guards', 'Shin Guards'),
        ('ankle_guards', 'Ankle Guards'),
        ('gloves', 'Gloves'),
        ('headbands', 'Headbands'),
        ('compression_sleeves', 'Compression Sleeves'),
        ('sports_tape', 'Sports Tape & Wraps'),
        ('bags', 'Bags & Backpacks'),
        ('water_bottles', 'Water Bottles'),
        ('other', 'Other Accessories'),
    ]

    name = models.CharField(max_length=100, choices=ALLOWED_CATEGORIES, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_name_display()


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            n = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{n}'
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ComboDiscount(models.Model):
    """Defines discount rules when N or more distinct category items are combined."""
    min_items = models.PositiveIntegerField(
        default=2,
        help_text='Minimum number of distinct items needed to unlock this discount',
    )
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text='Percentage discount applied to the combo total',
    )
    description = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['min_items']

    def __str__(self):
        return f'{self.discount_percent}% off for {self.min_items}+ items'


class Cart(models.Model):
    session_key = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Cart ({self.session_key})'

    def get_items(self):
        return self.items.select_related('product__category').all()

    def get_subtotal(self):
        return sum(item.get_total() for item in self.get_items())

    def get_combo_discount_amount(self):
        """Calculate combo discount based on number of distinct items in cart."""
        item_count = self.items.aggregate(total=models.Sum('quantity'))['total'] or 0
        rule = ComboDiscount.objects.filter(min_items__lte=item_count).order_by('-min_items').first()
        if rule:
            subtotal = self.get_subtotal()
            return round(subtotal * rule.discount_percent / 100, 2), rule
        return 0, None

    def get_total(self):
        subtotal = self.get_subtotal()
        discount, _ = self.get_combo_discount_amount()
        return subtotal - discount

    def get_item_count(self):
        return self.items.aggregate(total=models.Sum('quantity'))['total'] or 0


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f'{self.quantity}x {self.product.name}'

    def get_total(self):
        return self.product.price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    session_key = models.CharField(max_length=40)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.pk} - {self.first_name} {self.last_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.quantity}x {self.product_name}'

    def get_total(self):
        return self.price * self.quantity
