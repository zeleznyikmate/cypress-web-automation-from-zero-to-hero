/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

it('first test', {tags: '@smoke'}, ()=>{
    cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
    cy.intercept({method: 'GET', pathname: 'tags'}, {fixture: 'tags.json'})
    cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
    cy.loginToApplication()
})

it('modify api response', {retries: 2, tags: ['@smoke', '@likes']}, ()=>{
    cy.intercept('GET', '**/articles*', req =>{
        req.continue( res =>{
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})


it('waiting for apis', ()=>{
    cy.intercept('GET', '**/articles*').as('articleApiCall')
    cy.loginToApplication()
    cy.wait('@articleApiCall').then(apiArticleObject =>{
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})

it('delete article', ()=>{ 
    const titleOfTheArticle = faker.person.fullName()
    cy.loginToApplication()  

    cy.get('@accessToken').then(accessToken => {
        cy.request({
            url: Cypress.env('apiUrl')+'/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": titleOfTheArticle,
                    "description": faker.person.jobTitle(),
                    "body": faker.lorem.paragraph(10),
                    "tagList": []
                }
            },
            headers: {'Authorization': 'Token '+accessToken}
        }).then( response =>{
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal(titleOfTheArticle)
        })
    })

    cy.contains(titleOfTheArticle).click()
    cy.intercept('GET', '**/articles*').as('articleApiCall')
    cy.contains('button', 'Delete Article').first().click()
    cy.wait('@articleApiCall')
    cy.get('app-article-list').should('not.contain.text', titleOfTheArticle)
})

it('api testing', () => {
    cy.request({
        url: Cypress.env('apiUrl')+'/users/login',
        method: 'POST',
        body: {
            "user": {
            "email": "zeleznyik.mate@gmail.com",
            "password": "q4l-al0!"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        const accessToken = 'Token ' + response.body.user.token

        cy.request({
            url: Cypress.env('apiUrl')+'/articles/',
            method: 'POST',
            body: {
                "article": {
                "title": "Test title Cypress API Testing",
                "description": "Some description",
                "body": "This is a body",
                "tagList": []
                }
            },
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal('Test title Cypress API Testing')
        })

        cy.request({
            url: Cypress.env('apiUrl')+'/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.equal('Test title Cypress API Testing')
            const slugID = response.body.articles[0].slug

            cy.request({
                url: Cypress.env('apiUrl')+`/articles/${slugID}`,
                method: 'DELETE',
                headers: {'Authorization': accessToken}
            }).then(response => {
                expect(response.status).to.equal(204)
            })
        })

        cy.request({
            url: Cypress.env('apiUrl')+'/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.not.equal('Test title Cypress API Testing')
        })
    })
})
