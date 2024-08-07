import FileUpload from "../components/FileUpload";

const Home = () => {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="pl-5 font-signature font-bold text-4xl">Follrange</h1>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
};

export default Home;
