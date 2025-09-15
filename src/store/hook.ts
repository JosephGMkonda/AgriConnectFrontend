import { useDispatch,  useSelector } from "react-redux";
import type { AppDispatch } from "./index";


export const useAppSelector: typeof useSelector = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;