import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoMdDownload } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  // ✅ Fixed typos in options
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "REACT JS + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ⚠️ API Key
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyCOlDTbPRNj-ldHMRBrLt20U8SrWFfC1hs",
  });

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim())
      return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left Section */}
        <div
          className="
          w-full py-6 rounded-xl mt-5 p-5
          bg-white text-black border border-gray-200
          dark:bg-[#141319] dark:text-white dark:border-gray-800
        "
        >
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Generator
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mt-2 text-[16px]">
            Describe your component and let AI code it for you.
          </p>

          <p className="text-[15px] font-[700] mt-4">Framework</p>

          <Select
            className="mt-2"
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                  ? "#222"
                  : "#111",
                color: "#fff",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className="text-[15px] font-[700] mt-5">Describe your component</p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="
              w-full min-h-[200px] rounded-xl mt-3 p-3 resize-none
              bg-gray-100 text-black placeholder-gray-500
              dark:bg-[#09090B] dark:text-white dark:placeholder-gray-400
              outline-none focus:ring-2 focus:ring-purple-500
            "
            placeholder="Describe your component in detail..."
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click generate to get your code
            </p>

            <button
              onClick={getResponse}
              className="
                flex items-center gap-2 px-5 py-3 rounded-lg
                bg-gradient-to-r from-purple-400 to-purple-600
                hover:opacity-80 hover:scale-105 transition
              "
            >
              {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="
          relative mt-5 w-full h-[80vh] rounded-xl overflow-hidden
          bg-gray-100 border border-gray-200
          dark:bg-[#141319] dark:border-gray-800
        "
        >
          {!outputScreen ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="p-5 w-[70px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-[30px]">
                <HiOutlineCode />
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="h-[50px] flex gap-3 px-3 items-center bg-gray-200 dark:bg-[#17171C]">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 1
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-300 dark:bg-zinc-800 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  Code
                </button>

                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 2
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-300 dark:bg-zinc-800 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="h-[50px] flex items-center justify-between px-4 bg-gray-200 dark:bg-[#17171C]">
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  Code Editor
                </p>

                <div className="flex gap-2">
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode} className="icon-btn">
                        <IoCopy />
                      </button>
                      <button onClick={downnloadFile} className="icon-btn">
                        <IoMdDownload />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTabOpen(true)}
                        className="icon-btn"
                      >
                        <ImNewTab />
                      </button>
                      <button
                        onClick={() => setRefreshKey((k) => k + 1)}
                        className="icon-btn"
                      >
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme="vs-dark" />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="w-full h-full bg-white"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white dark:bg-black">
          <div className="h-[60px] flex justify-between items-center px-5 bg-gray-100 dark:bg-[#17171C]">
            <p className="font-bold">Preview</p>
            <button onClick={() => setIsNewTabOpen(false)}>
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]" />
        </div>
      )}
    </>
  );
};

export default Home;
