import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ReactMarkdown from "react-markdown";

const Docs = () => {
  const { topic } = useParams<{ topic: string }>();
  const { data, loading, error } = useFetch(`http://localhost:8080/docs?topic=${topic}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{topic?.toUpperCase()} Documentation</h1>
      <div className="prose dark:prose-invert mt-4">
        <ReactMarkdown>{data || "No documentation found."}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Docs;
