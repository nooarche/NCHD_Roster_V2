#!/bin/bash

echo "🧪 Testing HSE NCHD Rostering System Integration"
echo "================================================="

BASE_URL="http://localhost:8000"
FAILED=0
PASSED=0

# Helper function for tests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✓ PASSED (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo "✗ FAILED (HTTP $http_code)"
        echo "   Response: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo ""
echo "1. Testing Backend Health"
test_endpoint "GET" "/health" "" "Health check"

echo ""
echo "2. Testing Posts API"
test_endpoint "GET" "/api/posts" "" "List posts"

echo ""
echo "3. Testing Groups API"
test_endpoint "GET" "/api/groups" "" "List groups"

echo ""
echo "4. Testing Roster API"
test_endpoint "GET" "/api/roster/shifts" "" "List shifts"

echo ""
echo "5. Testing Shift Creation"
shift_data='{
  "user_id": 1,
  "post_id": 1,
  "start": "2025-08-15T09:00:00",
  "end": "2025-08-15T17:00:00",
  "shift_type": "day_call"
}'
test_endpoint "POST" "/api/roster/shifts" "$shift_data" "Create shift"

echo ""
echo "6. Testing EWTD Validation"
test_endpoint "GET" "/api/roster/validate" "" "EWTD validation"

echo ""
echo "================================================="
echo "Test Results: $PASSED passed, $FAILED failed"
echo "================================================="

if [ $FAILED -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check the output above."
    exit 1
fi
