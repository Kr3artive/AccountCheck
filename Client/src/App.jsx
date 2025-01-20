import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const App = () => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    axios
      .get("https://accountcheckapi.onrender.com/listbanks")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onSubmit = async (formData) => {
    const payload = {
      accountnum: formData.accountnum,
      code: formData.code,
    };
    try {
      const response = await axios.post(
        "https://accountcheckapi.onrender.com/getname",
        payload
      );
      console.log(response.data);
      setAccountName(
        response.data.data.account_name || "Account name not found"
      );
      alert("ACCOUNT NUMBER CHECKED SUCCESSFULLY, Click Ok");
    } catch (error) {
      console.log("ERROR CHECKING FOR ACCOUNT", error);
      alert("PLEASE CHECK YOUR NETWORK CONNECTION");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          CHECK FOR ACCOUNT NUMBER
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <input
            {...register("accountnum", { required: true })}
            className="p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Enter account number"
          />

          <div>
            <h1 className="text-md font-semibold mb-4 text-center">
              PLEASE SELECT YOUR BANK
            </h1>
            <select
              {...register("code", { required: true })}
              className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a bank</option>
              {data.map((list) => (
                <option key={list.code} value={list.code}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            CHECK
          </button>
        </form>

        {accountName && (
          <div className="mt-4 p-2 bg-green-100 rounded text-center">
            <strong>ACCOUNT NAME : {accountName}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
