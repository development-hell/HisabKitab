SUPPORTED_APPS = [
    {
        "key": "phonepe",
        "name": "PhonePe",
        "supports_wallet": True,
        "icon": "phonepe_icon_url_placeholder" # In a real app, this would be a URL
    },
    {
        "key": "gpay",
        "name": "Google Pay",
        "supports_wallet": False, # GPay India is mostly UPI, wallet is less common/different
        "icon": "gpay_icon_url_placeholder"
    },
    {
        "key": "paytm",
        "name": "Paytm",
        "supports_wallet": True,
        "icon": "paytm_icon_url_placeholder"
    },
    {
        "key": "amazon_pay",
        "name": "Amazon Pay",
        "supports_wallet": True,
        "icon": "amazon_pay_icon_url_placeholder"
    },
    {
        "key": "cash",
        "name": "Cash",
        "supports_wallet": False,
        "icon": "cash_icon_url_placeholder"
    },
    {
        "key": "card",
        "name": "Card (Debit/Credit)",
        "supports_wallet": False,
        "icon": "card_icon_url_placeholder"
    }
]
