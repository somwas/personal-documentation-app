import { Link } from "react-router-dom";

const Home = () => {
  const docsList = ["java", "python"]; // Add more dynamically later

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Documentation</h1>
      <ul>
        {docsList.map((doc) => (
          <li key={doc} className="mb-2">
            <Link
              to={`/docs/${doc}`}
              className="text-blue-500 hover:underline"
            >
              {doc.toUpperCase()} Docs
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
