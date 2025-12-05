from django.apps import AppConfig

class CoreTransactionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core_transaction'

    def ready(self):
        import core_transaction.signals
