from .models import Cart


def cart_count(request):
    """Make cart item count available in all templates."""
    count = 0
    if request.session.session_key:
        try:
            cart = Cart.objects.get(session_key=request.session.session_key)
            count = cart.get_item_count()
        except Cart.DoesNotExist:
            pass
    return {'cart_item_count': count}
