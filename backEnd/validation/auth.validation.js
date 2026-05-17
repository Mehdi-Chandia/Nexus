import Joi from "joi";

export const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),

    role: Joi.string()
        .valid("entrepreneur", "investor")
        .required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const entrepreneurProfileSchema = Joi.object({

    companyName: Joi.string()
        .min(2)
        .max(50)
        .required(),

    bio: Joi.string()
        .min(10)
        .max(500)
        .required(),

    location: Joi.string()
        .required(),

    industry: Joi.string()
        .required(),

    fundingNeeded: Joi.number()
        .min(1)
        .required()
});

export const investorProfileSchema = Joi.object({

    companyName: Joi.string()
        .min(2)
        .max(50)
        .required(),

    bio: Joi.string()
        .min(10)
        .max(500)
        .required(),

    location: Joi.string()
        .required(),

    industryInterested: Joi.string()
        .min(1)
        .required(),

    investmentMin: Joi.number()
        .min(1)
        .required(),

    investmentMax: Joi.number()
        .greater(Joi.ref("investmentMin"))
        .required()
});

export const meetingSchema = Joi.object({
    agenda: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
})