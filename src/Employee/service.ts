import axios from 'axios';

import { ObjectId, TransactionOptions, FindOneAndUpdateOption } from 'mongodb'; // import mongodb ObjectId

import { db, mongoClient } from '../configuration/database'; // import mongodb database


export const getAll = async (
  body: {
    skip: number,
    limit: number,
    needCount: boolean
    totalCount: number
  }
): Promise<any> => {
  try {
    const response: {
      count: number,
      records: any,
      needCount: boolean
    } = {
      count: body.totalCount,
      records: [],
      needCount: body.needCount
    }
    if (body.needCount) {
      const employeeCount = await db.collection('Employee').countDocuments({});
      response.count = employeeCount;
    }

    const employeeList: any = await new Promise((resolve, reject) => {
      db.collection('Employee')
        .aggregate([
          {
            $match: {}
          },
          {
            $project: {
              employee_name: 1,
              email_id: 1,
              phone_no: 1,
              sex: 1,
              flat_no: 1,
              street: 1,
              city: 1,
              state: 1,
              country: 1,
              pincode: 1,
              createdDate: 1,
              updatedDate: 1,
            }

          }
        ])
        .skip(body.skip)
        .limit(body.limit)
        .toArray((err, data) => {
          // check if error has occurred
          if (err) {
            reject({ isSuccess: false, message: err.message });
          } else {
            // resolve the data
            resolve({ isSuccess: true, data: data });
          }
        });
    });
    response.records = employeeList.data;

    return {
      isSuccess: true,
      data: response,
    };
  } catch (err) {
    console.log(err)
    return {
      isSuccess: false,
      message: "Error Code: P002, Internal Server Error",
    };
  }
};

export const create = async (
  body: any,
): Promise<any> => {
  try {
    console.log("body-->", body)
    const newEmployee: any = {
      employee_name: body.employee_name,
      email_id: body.email_id,
      phone_no: body.phone_no,
      sex: body.sex,
      flat_no: body.flat_no,
      street: body.street,
      city: body.city,
      state: body.state,
      country: body.country,
      pincode: body.pincode,
      createdDate: new Date(),
      updatedDate: new Date(),
    };


    const response = (await db.collection('Employee').insertOne(newEmployee)).ops[0];
    console.log("respnse-->", response)
    return {
      isSuccess: true,
      data: response,
    };
  } catch (err) {
    console.log("err-->", err);
    return {
      isSuccess: false,
      message: "Error Code: P003, Internal Server Error",
    };
  }
};

export const update = async (id: string, body: any): Promise<any> => {
  try {

    const updateRes = await db.collection('Employee').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          employee_name: body.employee_name,
          email_id: body.email_id,
          phone_no: body.phone_no,
          sex: body.sex,
          flat_no: body.flat_no,
          street: body.street,
          city: body.city,
          state: body.state,
          country: body.country,
          pincode: body.pincode,
          updatedDate: new Date(),
        }
      },
      {
        upsert: false
      }
    );

    return {
      isSuccess: true,
      data: updateRes,
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: "Error Code: P004, Internal Server Error",
    };
  }
};

export const remove = async (id: string): Promise<any> => {
  try {
    const deletedEmployee: number | undefined = (await db.collection('Employee').deleteOne({ _id: new ObjectId(id) })).deletedCount;
    return { isSuccess: (deletedEmployee && deletedEmployee == 1) as boolean, message: 'Employee deleted siccessfully' };
  } catch (err) {
    return {
      isSuccess: false,
      message: "Error Code: P006, Internal Server Error",
    };
  }
};
