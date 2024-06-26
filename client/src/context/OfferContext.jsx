import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios.js";
import { UserContext } from "./userContext.jsx";

export const OfferContext = createContext();

export const useOfferContext = () => useContext(OfferContext);

const OfferProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [offers, setOffers] = useState([]);
  const [foundOffer, setFoundOffer] = useState();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch offers
  const fetchOffers = async () => {
    try {
      const response = await axios.get(baseURL + `/offers`);
      if (response.data.success) {
        setOffers(response.data.offers);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Create offer
  const createOffer = async (e) => {
    e.preventDefault();
    const offerData = new FormData();
    offerData.append("title", e.target.title.value);
    offerData.append("description", e.target.description.value);
    offerData.append("location", e.target.location.value);
    offerData.append("type", e.target.type.value);
    offerData.append("category", e.target.category.value);
    offerData.append("salary", e.target.salary.value);
    offerData.append("skillsRequired", e.target.skillsRequired.value);
    offerData.append("status", e.target.status.value);
    offerData.append("createdBy", user._id);
    offerData.append("postImage", e.target["offer-image"].files[0]);

    try {
      const response = await axios.post(baseURL + `/offers/create`, offerData);
      if (response.data.success) {
        setOffers((prevOffers) => [...prevOffers, response.data.offer]);
        console.log("new offer", response.data.offer);

        e.target.reset();
      }
    } catch (error) {
      console.error("Failed to create offer:", error);
    }
  };

  // Delete offer
  const deleteOffer = async (offerId) => {
    try {
      const response = await axios.delete(baseURL + `/offers/${offerId}`);
      if (response.data.success) {
        const deletedOffer = response.data.deletedOffer;
        setOffers((offers) =>
          offers.filter((offer) => offer._id !== deletedOffer._id)
        );
        console.log("offers after delete", offers);
      }
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };

  //console.log("offers aft dlete", offers);
  // Update offer
  const updateOffer = async (offerId, updateData) => {
    try {
      const response = await axios.put(
        baseURL + `/offers/update/${offerId}`,
        updateData
      );
      if (response.data.success) {
        const updatedOffer = response.data.updatedPost;
        const updatedOffersArray = offers.map((offer) =>
          offer._id === offerId ? updatedOffer : offer
        );
        setOffers(updatedOffersArray);
        console.log("updated offer", response.data.updatedPost);
      }
    } catch (error) {
      console.error("Failed to update offer:", error);
    }
  };

  //apply offer
  const applyOffer = async (offerId, applicantId) => {
    try {
      const response = await axios.post(baseURL + "/offers/apply", {
        offerId,
        applicantId,
      });
      if (response.data.success) {
        const updatedOffers = offers.map((offer) => {
          if (offer._id === offerId) {
            return response.data.offer;
          }
          return offer;
        });

        setOffers(updatedOffers);
        setUser(response.data.applicant);

        console.log("Application successful", updatedOffers);
      }
    } catch (error) {
      console.error("Error applying to offer", error);
    }
  };

  // finding offer
  const findOffer = async (offerId) => {
    try {
      const response = await axios.get(baseURL + `/offers/find/${offerId}`);
      if (response.data.success) {
        setFoundOffer(response.data.offer);
      }
    } catch (error) {
      console.error("Error fetching offer by ID:", error);
    }
  };

  return (
    <OfferContext.Provider
      value={{
        offers,
        foundOffer,
        createOffer,
        updateOffer,
        deleteOffer,
        applyOffer,
        findOffer,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export default OfferProvider;
