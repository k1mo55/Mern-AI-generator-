import express from 'express'
import isAuthenticated from '../middelware/isAuthenticated.js';
import stripeController from '../controllers/handleStripePayment.js';

const router = express.Router();


router.post('/checkout',isAuthenticated,stripeController.handleStripePayment);
router.post('/free-plan',isAuthenticated,stripeController.handleFreeSubscription);
router.post('/verify-payment/:paymentId',isAuthenticated,stripeController.verifyPayment);

export default router
