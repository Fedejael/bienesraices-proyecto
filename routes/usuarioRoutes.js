import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({msg:"Hola Mundo en express"})
});



export default router