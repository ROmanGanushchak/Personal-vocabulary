import cProfile
import pstats
import io
from django.core.management.commands.runserver import Command as RunserverCommand

class Command(RunserverCommand):
    def inner_run(self, *args, **options):
        # Start profiling
        profiler = cProfile.Profile()
        profiler.enable()

        try:
            # Call the original inner_run method
            super().inner_run(*args, **options)
        finally:
            # Stop profiling
            profiler.disable()
            
            # Output profiling results
            s = io.StringIO()
            ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
            ps.print_stats()
            print(s.getvalue())