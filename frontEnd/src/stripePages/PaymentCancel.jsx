import {Link} from "react-router-dom";

const PaymentCancel=()=>{

    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="bg-slate-900 p-8 rounded-xl">

                <h1 className="text-3xl font-bold text-red-500">
                    Payment Cancelled
                </h1>

                <p className="mt-3">
                    Payment was not completed.
                </p>
                <div className="mt-4 text-center">
                    <Link className=" text-blue-400 hover:text-blue-500" to={"/investor-dashboard"}>Back to Dashboard</Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentCancel;