from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Listing
from .serializers import ListingSerializer
from users.permissions import IsAdminUserCustom


# Vendor creates listing → ALWAYS PENDING
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_listing(request):
    if request.user.role != 'VENDOR':
        return Response({"error": "Only vendors allowed"}, status=403)

    data = request.data.copy()
    data['vendor'] = request.user.id
    data['status'] = 'PENDING'

    serializer = ListingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Sent for admin approval"})
    return Response(serializer.errors, status=400)


# ONLY approved listings visible to users
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_listings(request):
    listings = Listing.objects.filter(status='APPROVED')
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)


# Vendor sees their own listings (all statuses)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_listings(request):
    if request.user.role != 'VENDOR':
        return Response({"error": "Unauthorized"}, status=403)

    listings = Listing.objects.filter(vendor=request.user)
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)


# Vendor deletes their own listing
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_listing(request, listing_id):
    if request.user.role != 'VENDOR':
        return Response({"error": "Unauthorized"}, status=403)

    try:
        listing = Listing.objects.get(id=listing_id, vendor=request.user)
        listing.delete()
        return Response({"message": "Listing deleted successfully"})
    except Listing.DoesNotExist:
        return Response({"error": "Listing not found or unauthorized"}, status=404)


# 🔥 ADMIN API — Approve Listing
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def approve_listing(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
        listing.status = 'APPROVED'
        listing.save()
        return Response({"message": "Listing approved"})
    except Listing.DoesNotExist:
        return Response({"error": "Listing not found"}, status=404)


# 🔥 ADMIN API — Get Pending Listings
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def get_pending_listings(request):
    listings = Listing.objects.filter(status='PENDING')
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def reject_listing(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
        listing.delete()
        return Response({"message": "Listing rejected"})
    except Listing.DoesNotExist:
        return Response({"error": "Not found"}, status=404)