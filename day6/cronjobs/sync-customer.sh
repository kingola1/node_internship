#!/bin/bash

SHOPIFY_STORE="your-shopify-store"
SHOPIFY_API_KEY="your-shopify-api-key"
SHOPIFY_PASSWORD="your-shopify-password"

response=$(curl -s -X GET -u "$SHOPIFY_API_KEY:$SHOPIFY_PASSWORD" "https://$SHOPIFY_STORE.myshopify.com/admin/api/2022-01/customers.json")

customer_data=$(echo "$response" | jq '.customers')

echo "$customer_data" | jq -c '.[]' | while read customer; do
  customer_id=$(echo "$customer" | jq -r '.id')
  email=$(echo "$customer" | jq -r '.email')

  existing_customer=$(psql -h localhost -U root -d day_1 -c "SELECT * FROM customer WHERE shopify_customer_id = '$customer_id';" | grep -c "$customer_id")

  if [ "$existing_customer" -eq 0 ]; then

    psql -h localhost -U root -d day_1 -c "INSERT INTO customer (shopify_customer_id, hopify_customer_email) VALUES ('$customer_id', '$email');"
    echo "Customer $customer_id added to the database."
  else
    echo "Customer $customer_id already exists in the database."
  fi
done
