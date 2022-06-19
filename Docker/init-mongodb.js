db.createUser(
{
    user : "ethicalinsight-user",
    pwd : "ethicalinsight-pwd",
    roles : [
        {
            role: "readWrite",
            db : "ethicalinsight-db"
        }
    ]      
}
)