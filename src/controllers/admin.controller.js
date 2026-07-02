import Product from "../models/product.model.js";
import User from "../models/user.model.js"


export const getAllUsers = async (req,res) => {
    try{
        const allUsers = await User.find().select('-password');
        res.status(200).json({allUsers});
    }catch (err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
    
}

export const getAllProducts = async (req,res) => {
    try{
        const products = await Product.find();
        return res.status(200).json({
            success:true,
            count:products.length,
            products
        });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
}