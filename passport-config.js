const localStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')


function initialize(passport, getUserByEmail, getUserById){

    const authUser=async (username,password,done)=>{
        const user = getUserByEmail(username)
        if(user==null){
            return done(null,false,{messge:'No user found'})
        }

        try{
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else {
                return done(null, false,{messge:'Incorrect Password'})
            }

        } catch(e) {
            return done(e)
        }
    }
    passport.use(new localStrategy({usernameField:'username'},authUser))

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser((id,done)=>{
        return done(null,getUserById(id))
    })
}


module.exports=initialize