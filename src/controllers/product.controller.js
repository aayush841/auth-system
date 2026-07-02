import Product from "../models/product.model.js";

export const addProduct = async (req,res) =>{
    try{
         const {name,price,description} = req.body;
    if(!name || !price){
        return res.status(400).json({
            success:false,
            message:"Name or Price is missing"
        });
    }
    const newProduct = new Product({name,price,description});
    newProduct.createdBy = req.user.id;
    await newProduct.save();

    return res.status(200).json({
        success:true,
        message:"Product successfully saved"
    });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
   
}

export const getProduct = async (req,res) => {
    try{
         const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product){
       return res.status(404).json({
            success:false,
            message:"product does not exist"
        })
    }
    if(!product.createdBy.equals(req.user.id)){
        return res.status(403).json({
            success:false,
            message:"You are not the owner of the product"
        });
    }
    return res.status(200).json({
        product
    });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
 
}
export const updateProduct = async (req,res) => {
    try{
        const {productId} = req.params;
    const product = await Product.findById(productId);
     if(!product){
       return res.status(404).json({
            success:false,
            message:"product does not exist"
        })
    }
    if(!product.createdBy.equals(req.user.id)){
        return res.status(403).json({
            success:false,
            message:"You are not the owner of the product"
        });
    }
    const {name, description, price} = req.body;
    if(name !== undefined){
        product.name = name;
    }
    if(price !== undefined){
        product.price = price;
    }
    if(description !== undefined){
        product.description = description;
    }
    await product.save();
    return res.status(200).json({
        success:true,
        message:"Product updated successfully"
    });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteProduct = async (req,res) => {
    try{
        const {productId} = req.params;
    const product = await Product.findById(productId);
     if(!product){
       return res.status(404).json({
            success:false,
            message:"product does not exist"
        });
    }
    if(!product.createdBy.equals(req.user.id)){
        return res.status(403).json({
            success:false,
            message:"You are not the owner of the product"
        });
    }
    await Product.deleteOne({_id:productId});
    return res.status(200).json({
        success:true,
        message:"Product deleted Successfully"
    });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
    
}