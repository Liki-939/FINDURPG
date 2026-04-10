from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VendorProfile
from .serializers import VendorSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vendor_profile(request):
    data = request.data.copy()
    data['user'] = request.user.id

    serializer = VendorSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)