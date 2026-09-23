# Feature Implementation Plan

## 1. Backend model and API updates
- Add a `Favourite` model for logged-in customer/product pairs and enforce uniqueness per user-product.
- Extend the `Review` model with a `date` field so each review records when it was posted.
- Add API read/write endpoints to list a logged-in user’s favourites, retrieve a favourite toggle state, and toggle a product favourite on/off.
- Add review sorting support for `rating` and `date` in both ascending and descending order.

## 2. Frontend feature updates
- Add a favourites page restricted to authenticated users and show the empty-state message exactly: “You don’t have a favourite product yet”.
- Add a favourite toggle button to the product details page, with the toggle visible only to authenticated users.
- Add review sorting controls and display the created date on each review card.
- Include navigation to the favourites page for logged-in users.

## 3. Database test data
- Update `db_volume/init/create_schema.sql` to include 20 realistic users and past-dated review records that exercise both date and rating sorting scenarios.
- Ensure the new data is seeded in a way that produces both ascending and descending ordering whenever the UI is used.

## 4. Unit test coverage
- Add Django tests that confirm:
  - a product can be favourited once and then unfavourited;
  - favourites are scoped to the logged-in user only;
  - empty favourites list shows the expected empty-state behaviour;
  - review date is present and sort-by rating/date works in both directions.

## 5. Verification
- Install project dependencies into a Python environment.
- Run the relevant Django tests for the item_store app and confirm they pass with fresh output.
