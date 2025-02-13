'use strict'

import { IGOTSOLUTIONSAxiosInstance } from "../../helper/axios";

const PropertyListing = async (sellerNo) => {
    try {
      const response = await IGOTSOLUTIONSAxiosInstance.get(
        `api/getPropertiesByDeveloperId/${sellerNo}`
      );
      const value = response.data.filter((d) => d.RecordStatus !== "inactive");
      return value;
    } catch (error) {
      throw error;
    }
  };
  
export { PropertyListing };
