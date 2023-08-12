const { User } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const data = req.body;
    console.log(data, "ini data");

    const schema = Joi.object({
      name: Joi.string().min(5).max(25).required(),
      email: Joi.string().email().min(6).max(25).required(),
      password: Joi.string().min(6).required().messages({
        "string.empty": `Password tidak boleh kosong`,
      }),
    });

    console.log(schema);

    const { error } = schema.validate(data);
    console.log(error, "ini error");
    if (error) {
      return res.status(400).send({
        status: "Bad request",
        message: error.details[0].message,
      });
    }

    const emailCheck = await User.findOne({
      where: { email: data.email },
    });

    if (emailCheck) {
      return res.status(400).send({
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    const newData = await User.create({
      name: data.name,
      email: data.email,
      password: hashPassword,
    });

    const dataToken = {
      id: newData.id,
    };

    const SECRET_KEY = process.env.TOKEN_KEY;
    const token = jwt.sign(dataToken, SECRET_KEY);

    res.status(200).send({
      status: "success",
      data: {
        name: newData.name,
        email: newData.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: "Server error occurred",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  //tangkap error
  console.log("login nih");

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createAt", "updateAt"],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "email or password can't finded",
      });
    }

    const dataToken = {
      id: userExist.id,
    };

    const SECRRET_KEY = process.env.TOKEN_KEY;
    const token = jwt.sign(dataToken, SECRRET_KEY);

    res.status(200).send({
      status: "success",
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "BAD REQUEST",
      message: "SERVER ERROR",
    });
  }
};
