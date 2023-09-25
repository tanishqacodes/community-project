interface Community{
    id : string;
    name : string | null;
    slug : string;
    owner : string;
    created_at : Date;
    updated_at : Date;
}

export default Community