
## BusyBuy - E-Commerce Web Application

BusyBuy is a comprehensive web application designed to enhance the shopping experience for users of an e-commerce platform. This version of BusyBuy leverages Redux Toolkit for efficient global state management.

### Features:

1. **Firebase Integration**:
   - Utilizes Firebase for backend services, including authentication and database management.

2. **User Registration**:
   - Provides a registration page for users to create an account and become members of the e-commerce platform.

3. **User Login**:
   - Offers a login page for registered users to securely access their accounts.

4. **Home Page**:
   - Displays a list of products available for purchase.
   - Includes a search feature allowing users to search for products by name.
   - Implements a sidebar for filtering products based on price and categories.

5. **Product Card Component**:
   - Presents product information such as image, title, and price.
   - Includes buttons to add or remove products from the cart.
   - Adjusts quantity for products already added to the cart.

6. **Cart Page**:
   - Shows the products that the user has added to the cart.
   - Provides functionality to adjust the quantity of products in the cart.

7. **Orders Page**:
   - Displays the products purchased by the user along with the order date.
   - Allows users to track their past orders.

### Additional Functionality:

- **Conditional Rendering**:
  - Implements conditional rendering to handle absence of data and loading states using the `react-spinners` library.

- **Toast Messages**:
  - Utilizes the `react-toastify` library to show toast messages for asynchronous actions and error conditions, enhancing user feedback.

### Technologies Used:

- React
- Firebase (Authentication, Firestore)
- Redux Toolkit (for global state management)
- React Router
- react-spinners
- react-toastify

### Getting Started:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure Firebase credentials.
4. Start the development server using `npm start`.

### Contributors:

- [Rahul Kumar Singh]

Feel free to contribute to BusyBuy by submitting bug reports, feature requests, or pull requests!

Enjoy your shopping experience with BusyBuy! 🛒🚀
