import { MongoClient , Db } from "mongodb";

function generateSlug(name : string) : string{
    return name
        .toLowerCase()
        .replace(/\s+/g,'-')
        .replace(/[^a-z0-9-]/g,'');
}

export async function generateUniqueSlug(db:Db ,name : string): Promise<string>{
    const tempSlug = generateSlug(name);
    let slug = tempSlug;
    let count = 1;
    const communities = db.collection('Community');
    while(true){
        const existingCommunity = await communities.findOne({tempSlug});
        if(!existingCommunity){
            return tempSlug;
        }
        slug =`${tempSlug}-${count}`;
        count++;
    }
}