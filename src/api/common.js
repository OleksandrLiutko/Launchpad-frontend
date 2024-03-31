import AxiosService from "./axiosService"
import token from "../pages/Dashboard/Lock/LockLists/Token";

const axiosService = new AxiosService()

export const createCampaignAPI = (token, data) => {
  axiosService.setHeader("Authorization", `Bearer ${token}`)
  return axiosService.post("/launchpads/campaign/create", data)
}

export const updateLaunchPad = (token, launchpadAddr, data) => {
  axiosService.setHeader("Authorization", `Bearer ${token}`)
  return axiosService.put(`/launchpads/${launchpadAddr}`, data)
}

export const getLaunchpadListAPI = (data) => {
  return axiosService.post("/launchpads/list", data)
}

export const getLaunchpadDetailAPI = (launchpadAddr) => {
  return axiosService.get(`/launchpads/${launchpadAddr}`)
}

export const getReceiptFromIPFS = (ip) => {
  const axiosService = new AxiosService("https://ipfs.io")
  return axiosService.get(`/ipfs/${ip}`, {timeout: 5000})
}
