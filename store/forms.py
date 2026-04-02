from django import forms


class CheckoutForm(forms.Form):
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'First Name'
    }))
    last_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'Last Name'
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-control', 'placeholder': 'Email Address'
    }))
    address = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'form-control', 'rows': 3, 'placeholder': 'Street Address'
    }))
    city = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'City'
    }))
    postal_code = forms.CharField(max_length=20, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'Postal Code'
    }))
