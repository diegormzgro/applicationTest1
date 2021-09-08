const ROLE = {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
    SELLER: 'SELLER',
    SUPPLIER: 'SUPPLIER'
}

function canViewProject(user, project) {
    return(
        user.role === ROLE.ADMIN || 
        project.user === user.id
    )
}

module.exports = {
    ROLE: ROLE,
    canViewProject
}