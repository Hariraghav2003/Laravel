import { useState } from "react";

const Form = () => {
  // Separate state variables for name and email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/adddata`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name, 
              email: email,  
            }),
          }
        );
        if (response.ok) {
          alert("Data Sent!!");
        } else {
          alert("Failed to send data");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">React Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-3">
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
