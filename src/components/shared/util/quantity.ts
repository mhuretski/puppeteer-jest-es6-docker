'use strict'
import { BACKSPACE, DELETE, LEFT, RIGHT } from '@const/global/keyboard.keys'
import AbstractContentObject from '@classes/util/abstract.content.object'

const quantity = {
  container: '#qtyId',
  decrease: '#qtyDecrease',
  increase: '#qtyIncrease',
  input: '#qtyInput',
}

export default quantity

export const itemsToAdd = async (
  page: AbstractContentObject,
  amount: number,
  position: number,
  quantityInputSelector: string) => {
  if (amount >= 1 && amount <= 99999) {
    const value = amount.toString()
    await page.clickOnPuppeteer(quantityInputSelector, position)
    await page.pressKeyboardKey(DELETE)
    const input = await page.getElementFromListPuppeteer(
      quantityInputSelector, position)
    if (value.length === 1) {
      await input.type(value)
      await page.pressKeyboardKey(LEFT)
      await page.pressKeyboardKey(BACKSPACE)
    } else {
      await input.type(value[0])
      await page.pressKeyboardKey(LEFT)
      await page.pressKeyboardKey(BACKSPACE)
      await page.pressKeyboardKey(RIGHT)
      await input.type(value.substring(1))
    }
  }
}
