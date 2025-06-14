import { 
    deleteUserService, 
    getAllUsersService, 
    getUserByIdService, 
    updateUserService 
} from "../models/userModel.js";

import { handleResponse } from '../utils/handleResponse.js';



//All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, "User Retrieved Succesfully", users);
    } catch (err) {
        next (err);
    }
};


//Single User
export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if(!user) return handleResponse(res, 404, "User does not exist.");
        handleResponse(res, 200, "User Retrieved Succesfully", user);
    } catch (err) {
        next (err);
    }
};


//Update User
export const updateUser = async (req, res, next) => {
    const {email} = req.body;
    try {
        const updatedUser = await updateUserService(req.params.id, email);
        if(!user) return handleResponse(res, 404, "User does not exist.");
        handleResponse(res, 200, "User Updated Succesfully", updatedUser);
    } catch (err) {
        next (err);
    }
};



//Delete User
export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await deleteUserService(req.params.id);
        if(!user) return handleResponse(res, 404, "User does not exist.");
        handleResponse(res, 200, "User Deleted Succesfully", deletedUserser);
    } catch (err) {
        next (err);
    }
};


