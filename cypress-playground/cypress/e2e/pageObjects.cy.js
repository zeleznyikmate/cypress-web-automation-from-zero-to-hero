/// <reference types="cypress" />

import { onDatepickerPage } from "../page-objects/datepickerPage"
import { onFormLayoutsPage } from "../page-objects/formLayoutsPAge"
import { navigateTo } from "../page-objects/navigationPage"

beforeEach('Open application', () => {
        //cy.visit('/')
        cy.openHomepage()
})

it('navigation test', () => {
    navigateTo.formLayoutsPage()
    navigateTo.datePickerPage()
    navigateTo.toastrPage()
    navigateTo.tooltipPage()
})

it.only('test with page object', () => {
    navigateTo.formLayoutsPage()
    onFormLayoutsPage.submitUsingTheGridForm('test@test.com', 'Welcome', 1)
    onFormLayoutsPage.submitUsingTheGridForm('test@test.com', 'somepassword', 0)
    onFormLayoutsPage.submitBasicForm('artem@test.com', 'Welcome', true)
    navigateTo.datePickerPage()
    onDatepickerPage.selectCommonDatepickerDateFromToday(5)
    onDatepickerPage.selectRangePickerDateFromToday(10, 50)
})