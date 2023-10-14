import bcrypt from 'bcrypt';

export const hashedPassword = async(password : String):Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hashSync(password,salt);
}