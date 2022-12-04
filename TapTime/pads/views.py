from django.shortcuts import render
from pads.models import Sample

# Create your views here.
def generate_index(request):
    samples = Sample.objects.all()
    context = {
        'samples' : samples
    }
    return render(request, 'index.html', context)