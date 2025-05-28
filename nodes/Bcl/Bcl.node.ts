import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeApiError,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Bcl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BCL',
		name: 'bcl',
		icon: 'file:bcl-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume BCL Payment API',
		defaults: {
			name: 'BCL',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'bclApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Payment Link',
						value: 'paymentLink',
					},
					{
						name: 'Form',
						value: 'form',
					},
					{
						name: 'Coupon',
						value: 'coupon',
					},
				],
				default: 'paymentLink',
			},
			// Payment Link Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'paymentLink',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new payment link',
						action: 'Create a payment link',
					},
					{
						name: 'Get Transaction',
						value: 'getTransaction',
						description: 'Get transaction details by order number',
						action: 'Get transaction details',
					},
				],
				default: 'create',
			},
			// Form Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'Get list of forms',
						action: 'List forms',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get form details by ID',
						action: 'Get a form',
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
						description: 'Update form active status',
						action: 'Update form status',
					},
					{
						name: 'Duplicate',
						value: 'duplicate',
						description: 'Duplicate a form',
						action: 'Duplicate a form',
					},
				],
				default: 'list',
			},
			// Coupon Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'coupon',
						],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'Get list of coupons',
						action: 'List coupons',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get coupon details by ID',
						action: 'Get a coupon',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update coupon details',
						action: 'Update a coupon',
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
						description: 'Update coupon active status',
						action: 'Update coupon status',
					},
				],
				default: 'list',
			},
			// Payment Link Create Fields
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: 0,
				description: 'Payment amount in MYR',
				required: true,
			},
			{
				displayName: 'Payer Name',
				name: 'payerName',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: '',
				description: 'Name of the person making the payment',
				required: true,
			},
			{
				displayName: 'Payer Email',
				name: 'payerEmail',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: '',
				description: 'Email address of the payer',
				required: true,
			},
			{
				displayName: 'Payer Telephone Number',
				name: 'payerTelephoneNumber',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: '',
				description: 'Malaysian mobile number format (e.g., 012-3456789)',
				required: true,
			},
			{
				displayName: 'Portal Key',
				name: 'portalKey',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: '',
				description: 'Bayarcash Portal Key from console.bayar.cash/portals',
				required: true,
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				options: [
					{
						displayName: 'Order Number',
						name: 'order_number',
						type: 'string',
						default: '',
						description: 'Unique identifier for the transaction (auto-generated if not provided)',
					},
					{
						displayName: 'Payment Channel',
						name: 'payment_channel',
						type: 'options',
						options: [
							{ name: 'FPX Online Banking', value: 1 },
							{ name: 'FPX Line of Credit', value: 4 },
							{ name: 'DuitNow Online Banking', value: 5 },
							{ name: 'DuitNow QR', value: 6 },
							{ name: 'SPaylater', value: 7 },
							{ name: 'Boost PayFlex', value: 8 },
							{ name: 'QRIS OB', value: 9 },
							{ name: 'QRIS Wallet', value: 10 },
							{ name: 'NETS', value: 11 },
						],
						default: 1,
						description: 'Payment channel to be used',
					},
					{
						displayName: 'Let User Choose Payment',
						name: 'let_user_choose_payment',
						type: 'boolean',
						default: false,
						description: 'Whether to allow user to choose payment method on the payment page',
					},
					{
						displayName: 'Remarks',
						name: 'remarks',
						type: 'string',
						default: '',
						description: 'Remark or notes for the order',
					},
				],
			},
			// Transaction Order Number
			{
				displayName: 'Order Number',
				name: 'orderNumber',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'getTransaction',
						],
						resource: [
							'paymentLink',
						],
					},
				},
				default: '',
				description: 'Order number to retrieve transaction details',
				required: true,
			},
			// Form List Options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'list',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 1,
						description: 'Page number',
					},
					{
						displayName: 'Per Page',
						name: 'per_page',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 10,
						description: 'Items per page',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search term',
					},
					{
						displayName: 'Sort By',
						name: 'sort_by',
						type: 'options',
						options: [
							{ name: 'Title', value: 'title' },
							{ name: 'Created At', value: 'created_at' },
							{ name: 'Updated At', value: 'updated_at' },
							{ name: 'Slug', value: 'slug' },
						],
						default: 'created_at',
						description: 'Sort by field',
					},
					{
						displayName: 'Sort Order',
						name: 'sort_order',
						type: 'options',
						options: [
							{ name: 'Ascending', value: 'asc' },
							{ name: 'Descending', value: 'desc' },
						],
						default: 'desc',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Active', value: 'active' },
							{ name: 'Inactive', value: 'inactive' },
						],
						default: 'all',
						description: 'Filter by status',
					},
				],
			},
			// Form ID
			{
				displayName: 'Form ID',
				name: 'formId',
				type: 'number',
				displayOptions: {
					show: {
						operation: [
							'get',
							'updateStatus',
						],
						resource: [
							'form',
						],
					},
				},
				default: 0,
				required: true,
			},
			// Form Status
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'updateStatus',
						],
						resource: [
							'form',
						],
					},
				},
				default: true,
				description: 'Whether the form is active',
				required: true,
			},
			// Duplicate Form Fields
			{
				displayName: 'Form ID',
				name: 'formIdToDuplicate',
				type: 'number',
				displayOptions: {
					show: {
						operation: [
							'duplicate',
						],
						resource: [
							'form',
						],
					},
				},
				default: 0,
				description: 'ID of the form to duplicate',
				required: true,
			},
			{
				displayName: 'Title',
				name: 'duplicateTitle',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'duplicate',
						],
						resource: [
							'form',
						],
					},
				},
				default: '',
				description: 'Title for the duplicated form',
				required: true,
			},
			{
				displayName: 'Slug',
				name: 'duplicateSlug',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'duplicate',
						],
						resource: [
							'form',
						],
					},
				},
				default: '',
				description: 'Slug for the duplicated form',
				required: true,
			},
			// Coupon List Options
			{
				displayName: 'Options',
				name: 'couponOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'list',
						],
						resource: [
							'coupon',
						],
					},
				},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 1,
						description: 'Page number',
					},
					{
						displayName: 'Per Page',
						name: 'per_page',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 10,
						description: 'Items per page',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search term',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Active', value: 'active' },
							{ name: 'Inactive', value: 'inactive' },
						],
						default: 'all',
						description: 'Filter by status',
					},
				],
			},
			// Coupon ID
			{
				displayName: 'Coupon ID',
				name: 'couponId',
				type: 'number',
				displayOptions: {
					show: {
						operation: [
							'get',
							'update',
							'updateStatus',
						],
						resource: [
							'coupon',
						],
					},
				},
				default: 0,
				required: true,
			},
			// Coupon Status
			{
				displayName: 'Is Active',
				name: 'couponIsActive',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'updateStatus',
						],
						resource: [
							'coupon',
						],
					},
				},
				default: true,
				description: 'Whether the coupon is active',
				required: true,
			},
			// Coupon Update Fields
			{
				displayName: 'Update Fields',
				name: 'couponUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'update',
						],
						resource: [
							'coupon',
						],
					},
				},
				options: [
					{
						displayName: 'Apply To',
						name: 'apply_to',
						type: 'options',
						options: [
							{ name: 'Total', value: 'total' },
							{ name: 'Items', value: 'items' },
						],
						default: 'total',
						description: 'Apply discount to',
					},
					{
						displayName: 'Code',
						name: 'code',
						type: 'string',
						default: '',
						description: 'Coupon code',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Coupon description',
					},
					{
						displayName: 'Discount Amount',
						name: 'discount_amount',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
					},
					{
						displayName: 'Discount Type',
						name: 'discount_type',
						type: 'options',
						options: [
							{ name: 'Percentage', value: 'percentage' },
							{ name: 'Fixed', value: 'fixed' },
						],
						default: 'percentage',
						description: 'Type of discount',
					},
					{
						displayName: 'Is Active',
						name: 'is_active',
						type: 'boolean',
						default: true,
						description: 'Whether the coupon is active',
					},
					{
						displayName: 'Usage Limit',
						name: 'usage_limit',
						type: 'number',
						default: 0,
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('bclApi');
		const baseUrl = credentials.baseUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;
				const options: IHttpRequestOptions = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${credentials.apiToken}`,
					},
					method: 'GET',
					url: '',
					json: true,
				};

				if (resource === 'paymentLink') {
					if (operation === 'create') {
						const amount = this.getNodeParameter('amount', i) as number;
						const payerName = this.getNodeParameter('payerName', i) as string;
						const payerEmail = this.getNodeParameter('payerEmail', i) as string;
						const payerTelephoneNumber = this.getNodeParameter('payerTelephoneNumber', i) as string;
						const portalKey = this.getNodeParameter('portalKey', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: Record<string, any> = {
							amount,
							payer_name: payerName,
							payer_email: payerEmail,
							payer_telephone_number: payerTelephoneNumber,
							portal_key: portalKey,
						};

						// Add additional fields
						if (additionalFields.order_number) {
							body.order_number = additionalFields.order_number;
						}
						if (additionalFields.payment_channel !== undefined) {
							body.payment_channel = additionalFields.payment_channel;
						}
						if (additionalFields.let_user_choose_payment !== undefined) {
							body.let_user_choose_payment = additionalFields.let_user_choose_payment;
						}
						if (additionalFields.remarks) {
							body.remarks = additionalFields.remarks;
						}

						options.method = 'POST';
						options.url = `${baseUrl}/payment-link`;
						options.body = body;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'getTransaction') {
						const orderNumber = this.getNodeParameter('orderNumber', i) as string;

						options.method = 'GET';
						options.url = `${baseUrl}/transaction/${orderNumber}`;

						responseData = await this.helpers.httpRequest(options);
					}
				} else if (resource === 'form') {
					if (operation === 'list') {
						const queryOptions = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams = Object.entries(queryOptions)
							.filter(([_, value]) => value !== '')
							.map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
							.join('&');

						options.method = 'GET';
						options.url = queryParams
							? `${baseUrl}/forms?${queryParams}`
							: `${baseUrl}/forms`;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'get') {
						const formId = this.getNodeParameter('formId', i) as number;

						options.method = 'GET';
						options.url = `${baseUrl}/forms/${formId}`;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'updateStatus') {
						const formId = this.getNodeParameter('formId', i) as number;
						const isActive = this.getNodeParameter('isActive', i) as boolean;

						options.method = 'PATCH';
						options.url = `${baseUrl}/forms/${formId}/status`;
						options.body = {
							is_active: isActive ? '1' : '0',
						};

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'duplicate') {
						const formId = this.getNodeParameter('formIdToDuplicate', i) as number;
						const title = this.getNodeParameter('duplicateTitle', i) as string;
						const slug = this.getNodeParameter('duplicateSlug', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/forms/duplicate`;
						options.body = {
							form_id: formId,
							title,
							slug,
						};

						responseData = await this.helpers.httpRequest(options);
					}
				} else if (resource === 'coupon') {
					if (operation === 'list') {
						const queryOptions = this.getNodeParameter('couponOptions', i, {}) as IDataObject;

						const queryParams = Object.entries(queryOptions)
							.filter(([_, value]) => value !== '')
							.map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
							.join('&');

						options.method = 'GET';
						options.url = queryParams
							? `${baseUrl}/coupons?${queryParams}`
							: `${baseUrl}/coupons`;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'get') {
						const couponId = this.getNodeParameter('couponId', i) as number;

						options.method = 'GET';
						options.url = `${baseUrl}/coupons/${couponId}`;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'update') {
						const couponId = this.getNodeParameter('couponId', i) as number;
						const updateFields = this.getNodeParameter('couponUpdateFields', i) as IDataObject;

						if (Object.keys(updateFields).length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one update field must be provided', { itemIndex: i });
						}

						options.method = 'PATCH';
						options.url = `${baseUrl}/coupons/${couponId}`;
						options.body = updateFields;

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'updateStatus') {
						const couponId = this.getNodeParameter('couponId', i) as number;
						const isActive = this.getNodeParameter('couponIsActive', i) as boolean;

						options.method = 'PATCH';
						options.url = `${baseUrl}/coupons/${couponId}/status`;
						options.body = {
							is_active: isActive ? '1' : '0',
						};

						responseData = await this.helpers.httpRequest(options);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				let errorMessage = error.message;
				let statusCode = 500;

				if (error.response) {
					statusCode = error.response.status;

					if (statusCode === 401) {
						errorMessage = 'Authentication failed: Invalid or expired API token. Please check your credentials.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 422) {
						errorMessage = 'Validation error: The API could not process your request.';

						if (error.response.data && error.response.data.errors) {
							errorMessage += ' Details: ' + JSON.stringify(error.response.data.errors);
						} else if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 403) {
						errorMessage = 'Forbidden: You do not have permission to access this resource.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode === 404) {
						errorMessage = 'Not found: The requested resource does not exist.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					} else if (statusCode >= 500) {
						errorMessage = 'Server error: The BCL server encountered an error.';

						if (error.response.data && error.response.data.message) {
							errorMessage += ` API says: ${error.response.data.message}`;
						}
					}
				}

				if (this.continueOnFail()) {
					const executionErrorData = {
						json: {
							error: errorMessage,
							statusCode: statusCode,
							timestamp: new Date().toISOString(),
						},
					};
					returnData.push(executionErrorData);
					continue;
				}

				throw new NodeApiError(this.getNode(), error, {
					message: `BCL API Error [${statusCode}]: ${errorMessage}`
				});
			}
		}

		return [returnData];
	}
}
