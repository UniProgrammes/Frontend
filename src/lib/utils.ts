import { Filter } from "bad-words"; 
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const badWordfilter: Filter = new Filter();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Function to check the name
export const checkName = async (planName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const regex = /^[a-zA-Z0-9 ]+$/;
    if (!regex.test(planName)) {
      reject(new Error("Invalid name"));
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (badWordfilter.isProfane(planName)) {
      reject(new Error("Invalid name"));
    }

    resolve(true);
  });
};






