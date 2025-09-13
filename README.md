
# **Xeno Shopify Dashboard – Frontend**

## **Overview**

This is the **frontend** of the Xeno Shopify Dashboard. Built with **React**, it provides a user-friendly interface for managing Shopify store data including orders, products, and customers. It communicates with the backend via REST APIs and updates in real-time.

---

## **Setup Instructions**

1. **Clone the repository**

```bash
git clone https://github.com/snehachaudhary05/fnp-frontend.git
cd fnp-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** in the root directory:

```
REACT_APP_API_URL=http://localhost:5000
```

*(Replace `http://localhost:5000` with your deployed backend URL if applicable.)*

4. **Start the development server**

```bash
npm start
```

* Open [http://localhost:3000](http://localhost:3000) in your browser.
* The page reloads automatically when you make changes.

5. **Build for production**

```bash
npm run build
```

* The `build` folder will contain optimized files ready for deployment.

---

## **Architecture Diagram**

```
[React Components / Pages]
          |
          v
[API Requests to Backend (Node.js/Express)]
          |
          v
[Display Data in Dashboard UI]

```

*You can replace this ASCII diagram with a visual diagram image if preferred.*

---

## **Features**

* **User Authentication:** Secure registration and login with JWT tokens.
* **Dashboard:** View orders, customers, total revenue, top 5 customers by spend in a clean UI.
* **Real-time Updates:** Data updates automatically via backend APIs and Shopify webhooks.
* **Responsive UI:** Works on both desktop and mobile devices.

---

## **Known Limitations / Assumptions**

* Assumes the backend server and APIs are running correctly.
* Tested mainly on Chrome desktop; minor UI issues may occur on other browsers or mobile devices.
* Some UI animations are minimal to maintain performance.
* Uses **REST APIs**; GraphQL is not implemented.


Do you want me to do that?
