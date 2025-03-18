/// <reference types="cypress" />

describe("Verificando API", () => {
    beforeEach(() => {
        cy.visit("/")
    })
    it('Verificando se a API está respondendo', () => {
        cy.request("GET", "https://api.coincap.io/v2/assets?limit=10&offset=0").should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("data")
            expect(response.body.data).to.be.an("array")
        }) 
    });
})