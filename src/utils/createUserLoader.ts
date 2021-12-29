import DataLoader from "dataloader"
import { User } from "../entity/User"


export const createUserLoader = () => new DataLoader<number,User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const toUserId: Record<number, User> ={};
    users.forEach(u => {
        toUserId[u.id] = u; 
    })

    const sortedUsers = userIds.map((userId)=>(toUserId[userId]));
    return sortedUsers;
});