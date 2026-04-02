from django.core.management.base import BaseCommand
from store.models import Category, Product, ComboDiscount


class Command(BaseCommand):
    help = 'Seed the database with sample football accessories'

    def handle(self, *args, **options):
        self.stdout.write('Seeding combo discounts...')
        ComboDiscount.objects.get_or_create(
            min_items=2,
            defaults={'discount_percent': 5, 'description': 'Buy any 2 items – save 5%'},
        )
        ComboDiscount.objects.get_or_create(
            min_items=3,
            defaults={'discount_percent': 10, 'description': 'Buy any 3 items – save 10%'},
        )
        ComboDiscount.objects.get_or_create(
            min_items=5,
            defaults={'discount_percent': 15, 'description': 'Buy any 5 items – save 15%'},
        )

        self.stdout.write('Seeding categories and products...')
        products_data = [
            {
                'category': 'socks',
                'products': [
                    {'name': 'Pro Grip Football Socks', 'price': '8.99', 'stock': 100,
                     'description': 'Anti-slip grip socks designed for maximum traction on the pitch. '
                                    'Moisture-wicking fabric keeps your feet dry throughout the match.'},
                    {'name': 'Compression Football Socks', 'price': '12.99', 'stock': 80,
                     'description': 'High-compression socks that improve blood circulation and reduce muscle fatigue. '
                                    'Perfect for intense training sessions and matches.'},
                    {'name': 'Classic Club Socks', 'price': '5.99', 'stock': 150,
                     'description': 'Traditional football socks in club colours. Durable and comfortable for '
                                    'everyday training.'},
                ],
            },
            {
                'category': 'shin_guards',
                'products': [
                    {'name': 'Elite Shin Guards', 'price': '24.99', 'stock': 60,
                     'description': 'Lightweight fiberglass shell with EVA foam backing. Meets all professional '
                                    'league standards. Adjustable straps for a secure fit.'},
                    {'name': 'Junior Shin Guards', 'price': '14.99', 'stock': 75,
                     'description': 'Designed specifically for younger players. Soft edges for comfort and '
                                    'polypropylene shell for solid protection.'},
                    {'name': 'Slip-In Shin Guards', 'price': '19.99', 'stock': 50,
                     'description': 'Streamlined slip-in design worn under socks. Ultra-thin yet highly protective. '
                                    'Popular with speed players.'},
                ],
            },
            {
                'category': 'ankle_guards',
                'products': [
                    {'name': 'Ankle Protector Sleeve', 'price': '9.99', 'stock': 90,
                     'description': 'Neoprene ankle sleeve providing support and warmth. Ideal for players '
                                    'recovering from minor ankle sprains.'},
                    {'name': 'Reinforced Ankle Guard', 'price': '18.99', 'stock': 40,
                     'description': 'Hard-shell ankle guard with soft lining. Provides maximum protection '
                                    'during tackles and physical play.'},
                ],
            },
            {
                'category': 'gloves',
                'products': [
                    {'name': 'Goalkeeper Match Gloves', 'price': '34.99', 'stock': 45,
                     'description': 'Professional goalkeeper gloves with latex palm. Superior grip in wet and '
                                    'dry conditions. Finger protection spines included.'},
                    {'name': 'Goalkeeper Training Gloves', 'price': '19.99', 'stock': 55,
                     'description': 'Durable training gloves built to withstand heavy use. Flat palm latex '
                                    'for consistent grip development.'},
                    {'name': 'Outfield Player Gloves', 'price': '12.99', 'stock': 70,
                     'description': 'Warm windproof gloves for outfield players in cold weather. Touchscreen '
                                    'compatible fingertips.'},
                ],
            },
            {
                'category': 'headbands',
                'products': [
                    {'name': 'Performance Sweatband', 'price': '6.99', 'stock': 120,
                     'description': 'Moisture-wicking terry cloth sweatband. Keeps sweat out of your eyes '
                                    'during intense activity.'},
                    {'name': 'Wide Sports Headband', 'price': '8.99', 'stock': 90,
                     'description': 'Wide non-slip headband suitable for all hair types. Provides extra '
                                    'coverage and style on the pitch.'},
                ],
            },
            {
                'category': 'compression_sleeves',
                'products': [
                    {'name': 'Calf Compression Sleeve', 'price': '14.99', 'stock': 65,
                     'description': 'Graduated compression sleeve supporting calf muscles. Reduces vibration '
                                    'and helps prevent cramps during long matches.'},
                    {'name': 'Arm Compression Sleeve', 'price': '11.99', 'stock': 55,
                     'description': 'Lightweight UV-protective arm sleeve. Keeps muscles warm and reduces '
                                    'risk of minor abrasions.'},
                ],
            },
            {
                'category': 'sports_tape',
                'products': [
                    {'name': 'Athletic Strapping Tape', 'price': '4.99', 'stock': 200,
                     'description': 'Rigid sports tape for joint support and injury prevention. Easy tear, '
                                    'skin-friendly adhesive.'},
                    {'name': 'Kinesiology Tape (5m Roll)', 'price': '7.99', 'stock': 160,
                     'description': 'Elastic therapeutic tape that supports muscles without restricting movement. '
                                    'Water resistant – lasts up to 5 days.'},
                ],
            },
            {
                'category': 'bags',
                'products': [
                    {'name': 'Football Kit Bag', 'price': '29.99', 'stock': 35,
                     'description': 'Spacious holdall with ventilated shoe compartment and multiple pockets. '
                                    'Fits a full match kit plus extras.'},
                    {'name': 'Training Backpack', 'price': '24.99', 'stock': 45,
                     'description': 'Ergonomic backpack with padded straps and dedicated ball net. '
                                    'Perfect for daily training commutes.'},
                ],
            },
            {
                'category': 'water_bottles',
                'products': [
                    {'name': 'Insulated Sports Bottle 750ml', 'price': '15.99', 'stock': 80,
                     'description': 'Double-wall stainless steel bottle keeps drinks cold for 24 hours. '
                                    'Leak-proof cap with easy-flow spout.'},
                    {'name': 'Squeeze Water Bottle 500ml', 'price': '6.99', 'stock': 110,
                     'description': 'Lightweight BPA-free squeeze bottle. Nozzle valve for quick hydration '
                                    'during breaks.'},
                ],
            },
        ]

        for cat_data in products_data:
            category, _ = Category.objects.get_or_create(name=cat_data['category'])
            for p in cat_data['products']:
                Product.objects.get_or_create(
                    name=p['name'],
                    defaults={
                        'category': category,
                        'price': p['price'],
                        'stock': p['stock'],
                        'description': p['description'],
                    },
                )

        self.stdout.write(self.style.SUCCESS(
            f'Done! {Product.objects.count()} products, '
            f'{Category.objects.count()} categories, '
            f'{ComboDiscount.objects.count()} discount rules seeded.'
        ))
