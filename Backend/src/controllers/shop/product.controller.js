import expressAsyncHandler from "express-async-handler";
import CustomError from "../../utils/CustomError.util.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import ProductModel from "../../models/product.model.js";

export const fetchProducts=expressAsyncHandler(async(req,res,next)=>{

    const {category=[],brand=[]}=req.query;
    // {brand: 'sony', category:'electronic}
    // {keyName:{$in:['v1',v2']}}

    let filterObject={};

    if(category.length>0){
        filterObject.category={$in:category.split(",")};
    }

    if(brand.length>0){
        filterObject.brand={$in:brand.split(",")};
    }


    let products=await ProductModel.find(filterObject);
    if(products.length ===0){
        return next(new CustomError(404,"No Products Found"));
    }

    new ApiResponse(200,"Product Fetched Successfully",products).send(res);
});

export const fetchProduct=expressAsyncHandler(async(req,res,next)=>{

});

export const searchProducts=expressAsyncHandler(async(req,res,next)=>{

})