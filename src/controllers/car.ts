import { Car, CarDocument } from "../models/Car";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import "../config/passport";
import { CallbackError, NativeError } from "mongoose";



/**
 * Signup page.
 * @route GET /signup
 */
export const getCreateCar = (req: Request, res: Response): void => {
    res.render("car/createNewCar", {
        title: "Create new Car"
    });
};

/**
 * Create a new car model
 * @route POST /createNewCar
 */
export const createNewCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const car = new Car({
        registrationNumber: req.body.registrationNumber,
        model: req.body.model,
        manufactured: req.body.manufactured,
        availableFromDate: req.body.availableFromDate,
        cost: req.body.cost
    });

    Car.findOne({ email: req.body.registrationNumber }, (err: NativeError, existingCar: CarDocument) => {
        if (err) { return next(err); }
        if (existingCar) {
            req.flash("errors", { msg: "This car is already exist" });
            return res.redirect("/createNewCar");
        }
        car.save((err) => {
            if (err) { return next(err); }
            res.redirect("/");
        });
    });
};


/**
 * Update car information.
 * @route POST /account/profile
 */
export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


    const car = req.body.model as CarDocument;
    Car.findById(car.registrationNumber, (err: NativeError, car: CarDocument) => {
        if (err) { return next(err); }
        car.registrationNumber = req.body.email || "";
        car.model = req.body.model || "";
        car.manufactured = req.body.manufactured || "";
        car.availableFromDate = req.body.availableFromDate || "";
        car.cost = req.body.cost || "";
        car.save((err: WriteError & CallbackError) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
                    return res.redirect("/account");
                }
                return next(err);
            }
            req.flash("success", { msg: "Profile information has been updated." });
            res.redirect("/car");
        });
    });
};