const request = require("supertest")
const app = require("../app")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTokens,
  testListingIds,
} = require("../tests/common")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/************************************** GET bookings/ */
describe("GET /bookings/", () => {
  test("Authed user can fetch all bookings they've made", async () => {
    const listingId = testListingIds[0]
    const res = await request(app).get(`/bookings`).set("authorization", `Bearer ${testTokens.jloToken}`)

    expect(res.statusCode).toEqual(200)

    const { bookings } = res.body
    expect(bookings.length).toEqual(2)

    const firstBooking = bookings[bookings.length - 1]

    firstBooking.totalCost = Number(firstBooking.totalCost)

    expect(firstBooking).toEqual({
      id: expect.any(Number),
      startDate: new Date("03-05-2021").toISOString(),
      endDate: new Date("03-07-2021").toISOString(),
      paymentMethod: "card",
      guests: 1,
      username: "jlo",
      hostUsername: "lebron",
      totalCost: expect.any(Number),
      listingId: listingId,
      userId: expect.any(Number),
      createdAt: expect.any(String),
    })
  })

  test("Throws Unauthorized error when user is unauthenticated", async () => {
    const res = await request(app).get(`/bookings/`)
    expect(res.statusCode).toEqual(401)
  })
})

/************************************** GET bookings/listings */
describe("GET /bookings/listings", () => {
  test("Authed user can fetch all bookings for any listings they own", async () => {
    const res = await request(app).get(`/bookings/listings`).set("authorization", `Bearer ${testTokens.lebronToken}`)

    expect(res.statusCode).toEqual(200)

    const { bookings } = res.body
    expect(bookings.length).toEqual(2)

    const firstBooking = bookings[bookings.length - 1]

    firstBooking.totalCost = Number(firstBooking.totalCost)

    expect(firstBooking).toEqual({
      id: expect.any(Number),
      startDate: new Date("03-05-2021").toISOString(),
      endDate: new Date("03-07-2021").toISOString(),
      paymentMethod: "card",
      guests: 1,
      username: "jlo",
      hostUsername: "lebron",
      totalCost: expect.any(Number),
      listingId: expect.any(Number),
      userId: expect.any(Number),
      createdAt: expect.any(String),
    })
  })

  test("Throws Unauthorized error when user is unauthenticated", async () => {
    const res = await request(app).get(`/bookings/listings`)
    expect(res.statusCode).toEqual(401)
  })
})

/************************************** POST bookings/listings/:listingId */
describle("POST bookings/listings/:listingId", () => {
  test("Authed user can book a listing they don't own.", () => {
    const listingId = testListingIds[0]
    const data = { newListing: {startDate: new Date("01-01-2021"), endDate: new Date("02-01-2021"), guests: 5} }
    
    const res = await request(app).post(`/bookings/listings/${listingId}`, data).set("authorization", `Bearer ${testTokens.jloToken}`)

    expect(res.statusCode).toEqual(201);
    expect(res).toEqual({
      id: expect.any(Number),
      startDate: data.newListing.startDate,
      endDate: data.newListing.endDate,
      paymentMethod: expect.any(String),
      guests: data.newListing.guests,
      listingId: listingId,
      username: expect.any(String),
      userId: expect.any(Number),
      createdAt: expect.any(String)
    })
  })

  test("Throws a Bad Request error when user attempts to book their own listing", () => {
    const listingId = testListingIds[0]
    const data = { newListing: {startDate: new Date("01-01-2021"), endDate: new Date("02-01-2021"), guests: 5} }

    const res = await request(app).post(`/bookings/listings/${listingId}`, data).set("authorization", `Bearer ${testTokens.lebronToken}`)
    expect(res.statusCode).toEqual(400)

  })
})

/************************************** GET bookings/listings/:listingId */
