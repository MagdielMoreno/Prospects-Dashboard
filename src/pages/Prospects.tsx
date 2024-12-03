import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import {
  DefaultProspect,
  getAllProspects,
  getProspectDocuments,
  Prospect,
  updateProspect,
} from "@/models/Prospect";
import Loading from "@/components/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { Doc } from "@/models/Document";
import LayoutPopup from "@/components/LayoutPopup";
import Popup from "@/components/Popup";

const Prospects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [currentProspect, setCurrentProspect] =
    useState<Prospect>(DefaultProspect);

  const [isAuthorized, setIsAuthorized] = useState(true);
  const [currentObservations, setCurrentObservations] = useState("");

  const [isEvaluateFormOpen, setIsEvaluateFormOpen] = useState(false);
  const [showEmptyError, setShowEmptyError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredProspects = prospects.filter(
    (prospect) =>
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.secondLastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prospect.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const prospects = await getAllProspects();
      setProspects(prospects);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const handleEvaluateProspect = async () => {
    if (currentObservations.length === 0) {
      if (!isAuthorized) {
        setIsEvaluateFormOpen(false);
        setShowEmptyError(true);
        return;
      } else {
        setCurrentObservations("");
      }
    }

    setIsLoading(true);

    if (currentProspect) {
      setIsEvaluateFormOpen(false);
      const updatedProspect = {
        ...currentProspect,
        observations: currentObservations,
        status: isAuthorized ? 2 : 3,
      };

      const newProspect = await updateProspect(updatedProspect);
      if (newProspect) {
        setProspects((prevProspects) =>
          prevProspects.map((prospect) =>
            prospect.id === newProspect.id ? newProspect : prospect
          )
        );
        setIsAuthorized(true);
      }
    }

    setIsLoading(false);
  };

  const UserCard = ({ prospect }: { prospect: Prospect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen((prev) => !prev);
    const [documents, setDocuments] = useState<Doc[]>([]);

    useEffect(() => {
      if (prospect.hasDocuments) {
        fetchDocuments();
      }
    }, [prospect.hasDocuments]);

    const fetchDocuments = async () => {
      const documents = await getProspectDocuments(prospect.id);
      setDocuments(documents);
    };

    const handleDownloadDoc = (doc: Doc) => {
      const base64Data = doc.document.toString();
      const fileName = doc.docName;
      console.log(doc);

      try {
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);

        const extension = fileName.split(".").pop()?.toLowerCase();
        let mimeType = "application/octet-stream";

        switch (extension) {
          case "pdf":
            mimeType = "application/pdf";
            break;
          case "jpg":
          case "jpeg":
            mimeType = "image/jpeg";
            break;
          case "png":
            mimeType = "image/png";
            break;
          case "gif":
            mimeType = "image/gif";
            break;
          case "txt":
            mimeType = "text/plain";
            break;
          case "doc":
            mimeType = "application/msword";
            break;
          case "docx":
            mimeType =
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            break;
          case "zip":
            mimeType = "application/zip";
            break;
          case "rar":
            mimeType = "application/x-rar-compressed";
            break;
        }

        const blob = new Blob([byteArray], { type: mimeType });

        const fileURL = URL.createObjectURL(blob);

        if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
          window.open(fileURL, "_blank");
        } else {
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = fileName || "archivo";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
      } catch (error) {
        console.error("Error al manejar el archivo:", error);
      }
    };

    return (
      <div className="w-full max-w-lg mx-auto">
        {/* Top Card */}
        <div
          onClick={toggleOpen}
          className="bg-background-1 p-4 rounded-2xl flex justify-between relative z-10 hover:cursor-pointer"
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full w-16 h-16 flex items-center justify-center text-xl font-medium bg-background-4 aspect-square">
              {prospect.name.charAt(0).toUpperCase()}
            </div>
            <div
              className="flex flex-col pe-2 truncate gap-1 flex-nowrap"
              style={{ maxWidth: "calc(100% - 1rem)" }}
            >
              <span className="font-medium text-sm md:text-base truncate">
                {prospect.name} {prospect.lastName} {prospect.secondLastName}
              </span>
              <span className="font-medium text-sm md:text-base truncate">
                {prospect.status === 1 ? (
                  <span className="bg-primary-1 px-2 text-xs md:text-sm rounded-full">
                    Enviado
                  </span>
                ) : prospect.status === 2 ? (
                  <span className="bg-green-700 px-2 text-xs md:text-sm rounded-full">
                    Autorizado
                  </span>
                ) : prospect.status === 3 ? (
                  <span className="bg-red-500 px-2 text-xs md:text-sm rounded-full">
                    Rechazado
                  </span>
                ) : null}
              </span>
            </div>
          </div>
          <button>
            <Icon
              icon="keyboard_arrow_down"
              className="self-center transition-transform duration-300 flex-nowrap"
              style={{
                fontSize: "28px",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>
        {/* Bottom Card */}
        <div
          className={`bg-background-2 p-4 rounded-b-2xl flex-col relative -mt-4 transition-all duration-500 ease-in-out ${
            isOpen
              ? "opacity-100 max-h-screen"
              : "opacity-0 max-h-0 p-0 overflow-hidden -mb-4"
          }`}
        >
          <div className="flex flex-col gap-2 p-2 pt-4">
            {/* Phone */}
            <div className="flex gap-4 items-center truncate">
              <Icon
                icon="phone"
                className="text-foreground-3"
                style={{ fontSize: "20px" }}
              />
              <div
                className="flex flex-col"
                style={{ maxWidth: "calc(100% - 5rem)" }}
              >
                <div className="flex flex-row gap-2">
                  <span className="font-medium text-sm md:text-base text-foreground-3 truncate">
                    {prospect.phone}
                  </span>
                </div>
                <span className="font-medium text-xs text-foreground-6 truncate">
                  Teléfono
                </span>
              </div>
            </div>

            {/* Documents */}
            <div className="flex gap-4 items-center truncate">
              <Icon
                icon="docs"
                className="text-foreground-3"
                style={{ fontSize: "20px" }}
              />
              <div
                className="flex flex-col"
                style={{ maxWidth: "calc(100% - 5rem)" }}
              >
                <div className="flex flex-row gap-2">
                  <span className="font-medium text-sm md:text-base text-foreground-3 truncate">
                    {prospect.hasDocuments ? (
                      <div key={prospect.id}>
                        {documents.length === 0 ? (
                          <p>Cargando...</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {documents.map((document) => (
                              <span
                                className="text-xs flex gap-1 items-center "
                                key={document.id}
                              >
                                <button
                                  onClick={() => handleDownloadDoc(document)}
                                  className="bg-primary-1 w-6 h-6 text-xs md:text-sm rounded-full aspect-square"
                                >
                                  <Icon
                                    icon="download"
                                    className="text-foreground-1 self-center aspect-square justify-center"
                                    style={{ fontSize: "14px" }}
                                  />
                                </button>
                                {document.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      "Ninguno"
                    )}
                  </span>
                </div>
                <span className="font-medium text-xs text-foreground-6 truncate">
                  Documentos
                </span>
              </div>
            </div>

            {/* Observations */}
            <div
              className={`${prospect.observations ? "flex" : "hidden"} gap-4 items-center truncate`}
            >
              <Icon
                icon="chat"
                className="text-foreground-3"
                style={{ fontSize: "20px" }}
              />
              <div
                className="flex flex-col"
                style={{ maxWidth: "calc(100% - 5rem)" }}
              >
                <div className="flex flex-row gap-2">
                  <span className="font-medium text-sm md:text-base text-foreground-3 truncate">
                    {prospect.observations}
                  </span>
                </div>
                <span className="font-medium text-xs text-foreground-6 truncate">
                  Observaciones
                </span>
              </div>
            </div>

            {/* Evaluate Button */}
            <div
              className={`${prospect.status === 1 ? "flex" : "hidden"} justify-center text-sm md:text-base`}
            >
              <button
                onClick={() => {
                  setCurrentProspect(prospect);
                  setIsEvaluateFormOpen(true);
                }}
                className="flex w-28 items-center bg-primary-1 px-4 py-1 rounded-full gap-2 justify-between"
              >
                Evaluar
                <Icon
                  icon="data_check"
                  className="self-center transition-transform duration-300 flex-nowrap"
                  style={{ fontSize: "20px" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 bg-background-3 md:px-12 px-6">
      <div className="flex justify-between gap-4">
        {/* Search Bar */}
        <div className="bg-background-1 rounded-2xl flex flex-row justify-center flex-grow w-full">
          <Icon icon="search" className="text-foreground-4 self-center ms-4" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-inherit rounded-2xl p-4 flex-grow w-full sm:w-auto placeholder:text-foreground-4 outline-none"
          />
        </div>
      </div>

      {/* Users */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredProspects.length > 0 ? (
            filteredProspects.map((prospect) => (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, transform: "scale(0.95)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0, transform: "scale(0.95)" }}
                transition={{ duration: 0.3 }}
              >
                <UserCard key={prospect.id} prospect={prospect} />
              </motion.div>
            ))
          ) : !isLoading ? (
            <div className="col-span-full text-center text-lg font-medium p-8">
              No hay prospectos disponibles...
            </div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Empty Fields Error */}
      <Popup
        title="Error"
        visible={showEmptyError}
        message="Llena todos los campos obligatorios (*)"
        icon="error"
        onConfirm={() => {
          setIsEvaluateFormOpen(true);
          setShowEmptyError(false);
        }}
        onCancel={() => {
          setIsEvaluateFormOpen(true);
          setShowEmptyError(false);
        }}
      />

      {/* Evaluate Prospect */}
      <LayoutPopup
        title="Evaluar prospecto"
        visible={isEvaluateFormOpen}
        icon="data_check"
        buttonText="Guardar"
        onConfirm={handleEvaluateProspect}
        onCancel={() => {
          setCurrentProspect(DefaultProspect);
          setIsEvaluateFormOpen(false);
        }}
      >
        <div className="flex flex-col items-center pb-10 pt-4 gap-1">
          {/* Prospect Icon */}
          <div className="rounded-full w-24 h-24 flex items-center justify-center text-3xl font-medium bg-background-4 aspect-square">
            {currentProspect.name.charAt(0).toUpperCase()}
          </div>

          {/* Prospect Name */}
          <h5 className="mb-1 text-xl font-medium">
            {currentProspect.name} {currentProspect.lastName}{" "}
            {currentProspect.secondLastName}
          </h5>

          {/* Prospect Phone */}
          <span className="text-sm text-foreground-4">
            {currentProspect.phone}
          </span>

          {/* Prospect Status */}
          <div className="flex flex-row gap-2 items-center mt-2 text-sm">
            <span
              className={`font-medium ${isAuthorized ? "text-foreground-1" : "text-foreground-5"}`}
            >
              Autorizar
            </span>
            <div
              onClick={() => setIsAuthorized(!isAuthorized)}
              className={`${isAuthorized ? "bg-green-700" : "bg-red-500"} h-10 w-20 rounded-xl items-center align-middle cursor-pointer`}
            >
              <div
                className={`flex ${isAuthorized ? "flex-row" : "flex-row-reverse"} items-center h-full px-1.5 transition-all duration-300`}
              >
                <Icon
                  icon={isAuthorized ? "check" : "close"}
                  className="bg-foreground-1 text-background-1 rounded-lg"
                  style={{ fontSize: "28px" }}
                />
              </div>
            </div>
            <span
              className={`font-medium ${!isAuthorized ? "text-foreground-1" : "text-foreground-5"}`}
            >
              Rechazar
            </span>
          </div>

          {/* Prospect Observations */}
          {isAuthorized ? null : (
            <textarea
              rows={4}
              maxLength={100}
              placeholder="Observaciones *"
              value={currentObservations}
              onChange={(e) => setCurrentObservations(e.target.value)}
              className="bg-background-2 rounded-xl p-4 w-full mt-4 resize-none outline-none placeholder:text-foreground-4"
            />
          )}
        </div>
      </LayoutPopup>

      {/* Loading */}
      <Loading visible={isLoading} />
    </div>
  );
};

export default Prospects;
