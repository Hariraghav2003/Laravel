import { useState } from "react";

const Form = () => {
  // Separate state variables for name, email, file, and preview URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // State to store image preview
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "Only image files are allowed",
      }));
      setFile(null); // Reset the file input if the file is not an image
      setPreview(null); // Clear the preview if the file is not an image
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
      setFile(selectedFile);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set the preview to the file's data URL
      };
      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Invalid email";
    if (!file) newErrors.file = "File is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("file", file);

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/adddata`,
          {
            method: "POST",
            body: formData,
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
        <div className="mb-3">
          <label className="block font-medium">Upload Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*" // Accept only image files
            className="w-full p-2 border rounded"
          />
          {errors.file && <p className="text-red-500">{errors.file}</p>}

          {/* Show image preview if a valid image file is selected */}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className=" h-auto max-h-64 object-contain"
                style={{width:"200px"}}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
