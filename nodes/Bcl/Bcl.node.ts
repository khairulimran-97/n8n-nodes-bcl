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
	IHttpRequestMethods,
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
						name: 'Duplicate',
						value: 'duplicate',
						action: 'Duplicate a form',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a form',
					},
					{
						name: 'List',
						value: 'list',
						action: 'List forms',
					},
					{
						name: 'Update Affiliate Settings',
						value: 'updateAffiliate',
						action: 'Update affiliate settings',
					},
					{
						name: 'Update Content',
						value: 'updateContent',
						action: 'Update form content',
					},
					{
						name: 'Update Facebook Pixel',
						value: 'updateFacebookPixel',
						action: 'Update facebook pixel settings',
					},
					{
						name: 'Update Homepage Display',
						value: 'updateHomepage',
						action: 'Update homepage display',
					},
					{
						name: 'Update Redirect URLs',
						value: 'updateRedirectUrls',
						action: 'Update redirect urls',
					},
					{
						name: 'Update Slug',
						value: 'updateSlug',
						action: 'Update form slug',
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
						action: 'Update form status',
					},
					{
						name: 'Update Stock',
						value: 'updateStock',
						action: 'Update stock quantities',
					},
					{
						name: 'Update TikTok Pixel',
						value: 'updateTiktokPixel',
						action: 'Update tiktok pixel settings',
					},
					{
						name: 'Update Title',
						value: 'updateTitle',
						action: 'Update form title',
					},
					{
						name: 'Update Webhook Settings',
						value: 'updateWebhook',
						action: 'Update webhook settings',
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
						name: 'Get',
						value: 'get',
						action: 'Get a coupon',
					},
					{
						name: 'List',
						value: 'list',
						action: 'List coupons',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a coupon',
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
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
							'updateHomepage',
							'updateSlug',
							'updateTitle',
							'updateContent',
							'updateStock',
							'updateAffiliate',
							'updateRedirectUrls',
							'updateWebhook',
							'updateFacebookPixel',
							'updateTiktokPixel',
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
			// Homepage Display
			{
				displayName: 'Show On Homepage',
				name: 'showOnHomepage',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'updateHomepage',
						],
						resource: [
							'form',
						],
					},
				},
				default: true,
				description: 'Whether to show the form on homepage',
				required: true,
			},
			// Form Slug
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'updateSlug',
						],
						resource: [
							'form',
						],
					},
				},
				default: '',
				description: 'Form URL slug',
				required: true,
			},
			// Form Title
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'updateTitle',
						],
						resource: [
							'form',
						],
					},
				},
				default: '',
				description: 'Form title',
				required: true,
			},
			// Form Content
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				displayOptions: {
					show: {
						operation: [
							'updateContent',
						],
						resource: [
							'form',
						],
					},
				},
				default: '',
				description: 'Custom HTML content for the form',
				required: true,
			},
			// Stock Update
			{
				displayName: 'Stock Items',
				name: 'stockItems',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: [
							'updateStock',
						],
						resource: [
							'form',
						],
					},
				},
				default: {},
				options: [
					{
						name: 'items',
						displayName: 'Items',
						values: [
							{
								displayName: 'Item ID',
								name: 'id',
								type: 'number',
								default: 0,
								required: true,
							},
							{
								displayName: 'Stock Quantity',
								name: 'stock',
								type: 'number',
								typeOptions: {
									minValue: 0,
									maxValue: 999999,
								},
								default: 0,
								required: true,
							},
						],
					},
				],
			},
			// Affiliate Settings
			{
				displayName: 'Affiliate Settings',
				name: 'affiliateSettings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateAffiliate',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Enable Affiliate',
						name: 'enable_affiliate',
						type: 'boolean',
						default: false,
						description: 'Whether to enable affiliate program for this form',
					},
					{
						displayName: 'Show Affiliate Info',
						name: 'show_affiliate_info',
						type: 'boolean',
						default: false,
						description: 'Whether to show affiliate information on the form',
					},
					{
						displayName: 'Override Commission Settings',
						name: 'override_commission_settings',
						type: 'boolean',
						default: false,
						description: 'Whether to override global commission settings',
					},
				],
			},
			// Redirect URLs
			{
				displayName: 'Redirect URLs',
				name: 'redirectUrls',
				type: 'collection',
				placeholder: 'Add URL',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateRedirectUrls',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Success URL',
						name: 'success_url',
						type: 'string',
						default: '',
						description: 'URL to redirect after successful payment',
					},
					{
						displayName: 'Failed URL',
						name: 'failed_url',
						type: 'string',
						default: '',
						description: 'URL to redirect after failed payment',
					},
				],
			},
			// Webhook Settings
			{
				displayName: 'Webhook Settings',
				name: 'webhookSettings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateWebhook',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: false,
						description: 'Whether to enable webhook notifications',
					},
					{
						displayName: 'Webhook URL',
						name: 'url',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Events',
						name: 'events',
						type: 'multiOptions',
						options: [
							{ name: 'Form Submit', value: 'form-submit' },
							{ name: 'Payment Success', value: 'payment-success' },
							{ name: 'Direct Debit', value: 'direct-debit' },
						],
						default: [],
					},
				],
			},
			// Facebook Pixel Settings
			{
				displayName: 'Facebook Pixel Settings',
				name: 'facebookPixelSettings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateFacebookPixel',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Enable Facebook Pixel',
						name: 'enable_facebook_pixel',
						type: 'boolean',
						default: false,
						description: 'Whether to enable Facebook pixel tracking',
					},
					{
						displayName: 'Facebook Pixel ID',
						name: 'facebook_pixel_id',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Enable Facebook API',
						name: 'enable_facebook_api',
						type: 'boolean',
						default: false,
						description: 'Whether to enable Facebook Conversion API',
					},
					{
						displayName: 'Facebook API Token',
						name: 'facebook_api_token',
						type: 'string',
						typeOptions: { password: true },
						default: '',
					},
				],
			},
			// TikTok Pixel Settings
			{
				displayName: 'TikTok Pixel Settings',
				name: 'tiktokPixelSettings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateTiktokPixel',
						],
						resource: [
							'form',
						],
					},
				},
				options: [
					{
						displayName: 'Enable TikTok Pixel',
						name: 'enable_tiktok_pixel',
						type: 'boolean',
						default: false,
						description: 'Whether to enable TikTok pixel tracking',
					},
					{
						displayName: 'TikTok Pixel ID',
						name: 'tiktok_pixel_id',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Enable TikTok API',
						name: 'enable_tiktok_api',
						type: 'boolean',
						default: false,
						description: 'Whether to enable TikTok Events API',
					},
					{
						displayName: 'TikTok API Token',
						name: 'tiktok_api_token',
						type: 'string',
						typeOptions: { password: true },
						default: '',
					},
				],
			},
			// Duplicate Form Fields
			{
				displayName: 'Form ID to Duplicate',
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
				displayName: 'Duplicate Title',
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
				displayName: 'Duplicate Slug',
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
						displayName: 'Sort By',
						name: 'sort_by',
						type: 'options',
						options: [
							{ name: 'Code', value: 'code' },
							{ name: 'Created At', value: 'created_at' },
							{ name: 'Updated At', value: 'updated_at' },
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
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
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
						displayName: 'Enable Condition',
						name: 'enable_condition',
						type: 'boolean',
						default: false,
						description: 'Whether to enable purchase conditions',
					},
					{
						displayName: 'Enable Expiry',
						name: 'enable_expiry',
						type: 'boolean',
						default: false,
						description: 'Whether to enable expiry dates',
					},
					{
						displayName: 'Expiry Date',
						name: 'expiry_date',
						type: 'dateTime',
						default: '',
						description: 'Expiry date and time',
					},
					{
						displayName: 'Is Active',
						name: 'is_active',
						type: 'boolean',
						default: true,
						description: 'Whether the coupon is active',
					},
					{
						displayName: 'Max Purchase',
						name: 'max_purchase',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						description: 'Maximum purchase amount',
					},
					{
						displayName: 'Min Purchase',
						name: 'min_purchase',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						description: 'Minimum purchase amount',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date and time',
					},
					{
						displayName: 'Usage Limit',
						name: 'usage_limit',
						type: 'number',
						default: 0,
						description: 'Usage limit for the coupon',
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
		const apiToken = credentials.apiToken as string;
		const baseUrl = 'https://bcl.my/api';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let method: IHttpRequestMethods = 'GET';
				let endpoint = '';
				let body: IDataObject = {};

				if (resource === 'paymentLink') {
					if (operation === 'create') {
						endpoint = '/payment-link';
						method = 'POST' as IHttpRequestMethods;
						const amount = this.getNodeParameter('amount', i) as number;
						const payerName = this.getNodeParameter('payerName', i) as string;
						const payerEmail = this.getNodeParameter('payerEmail', i) as string;
						const payerTelephoneNumber = this.getNodeParameter('payerTelephoneNumber', i) as string;
						const portalKey = this.getNodeParameter('portalKey', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						body = {
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
					} else if (operation === 'getTransaction') {
						const orderNumber = this.getNodeParameter('orderNumber', i) as string;
						endpoint = `/transaction/${orderNumber}`;
						method = 'GET' as IHttpRequestMethods;
					}
				} else if (resource === 'form') {
					if (operation === 'list') {
						endpoint = '/forms';
						method = 'GET' as IHttpRequestMethods;
						const queryOptions = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams = Object.entries(queryOptions)
							.filter(([_, value]) => value !== '' && value !== undefined)
							.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
							.join('&');

						if (queryParams) {
							endpoint += `?${queryParams}`;
						}
					} else if (operation === 'get') {
						const formId = this.getNodeParameter('formId', i) as number;
						endpoint = `/forms/${formId}`;
						method = 'GET' as IHttpRequestMethods;
					} else if (operation === 'updateStatus') {
						const formId = this.getNodeParameter('formId', i) as number;
						const isActive = this.getNodeParameter('isActive', i) as boolean;
						endpoint = `/forms/${formId}/status`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							is_active: isActive ? '1' : '0',
						};
					} else if (operation === 'duplicate') {
						const formId = this.getNodeParameter('formIdToDuplicate', i) as number;
						const title = this.getNodeParameter('duplicateTitle', i) as string;
						const slug = this.getNodeParameter('duplicateSlug', i) as string;
						endpoint = '/forms/duplicate';
						method = 'POST' as IHttpRequestMethods;
						body = {
							form_id: formId,
							title,
							slug,
						};
					} else if (operation === 'updateHomepage') {
						const formId = this.getNodeParameter('formId', i) as number;
						const showOnHomepage = this.getNodeParameter('showOnHomepage', i) as boolean;
						endpoint = `/forms/${formId}/homepage`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							show_on_homepage: showOnHomepage ? '1' : '0',
						};
					} else if (operation === 'updateSlug') {
						const formId = this.getNodeParameter('formId', i) as number;
						const slug = this.getNodeParameter('slug', i) as string;
						endpoint = `/forms/${formId}/slug`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							slug,
						};
					} else if (operation === 'updateTitle') {
						const formId = this.getNodeParameter('formId', i) as number;
						const title = this.getNodeParameter('title', i) as string;
						endpoint = `/forms/${formId}/title`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							title,
						};
					} else if (operation === 'updateContent') {
						const formId = this.getNodeParameter('formId', i) as number;
						const content = this.getNodeParameter('content', i) as string;
						endpoint = `/forms/${formId}/content`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							content_editor: content,
						};
					} else if (operation === 'updateStock') {
						const formId = this.getNodeParameter('formId', i) as number;
						const stockItems = this.getNodeParameter('stockItems', i) as IDataObject;

						if (!stockItems.items || (stockItems.items as IDataObject[]).length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one stock item must be provided', { itemIndex: i });
						}

						endpoint = `/forms/${formId}/stock`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							items: stockItems.items,
						};
					} else if (operation === 'updateAffiliate') {
						const formId = this.getNodeParameter('formId', i) as number;
						const affiliateSettings = this.getNodeParameter('affiliateSettings', i) as IDataObject;
						endpoint = `/forms/${formId}/affiliate`;
						method = 'PATCH' as IHttpRequestMethods;

						body = {};
						if (affiliateSettings.enable_affiliate !== undefined) {
							body.enable_affiliate = affiliateSettings.enable_affiliate ? '1' : '0';
						}
						if (affiliateSettings.show_affiliate_info !== undefined) {
							body.show_affiliate_info = affiliateSettings.show_affiliate_info ? '1' : '0';
						}
						if (affiliateSettings.override_commission_settings !== undefined) {
							body.override_commission_settings = affiliateSettings.override_commission_settings ? '1' : '0';
						}
					} else if (operation === 'updateRedirectUrls') {
						const formId = this.getNodeParameter('formId', i) as number;
						const redirectUrls = this.getNodeParameter('redirectUrls', i) as IDataObject;
						endpoint = `/forms/${formId}/redirect-urls`;
						method = 'PATCH' as IHttpRequestMethods;

						body = {};
						if (redirectUrls.success_url) {
							body.success_url = redirectUrls.success_url;
						}
						if (redirectUrls.failed_url) {
							body.failed_url = redirectUrls.failed_url;
						}
					} else if (operation === 'updateWebhook') {
						const formId = this.getNodeParameter('formId', i) as number;
						const webhookSettings = this.getNodeParameter('webhookSettings', i) as IDataObject;
						endpoint = `/forms/${formId}/webhook`;
						method = 'PATCH' as IHttpRequestMethods;

						body = {
							enabled: webhookSettings.enabled,
						};
						if (webhookSettings.url) {
							body.url = webhookSettings.url;
						}
						if (webhookSettings.events) {
							body.events = webhookSettings.events;
						}
					} else if (operation === 'updateFacebookPixel') {
						const formId = this.getNodeParameter('formId', i) as number;
						const fbSettings = this.getNodeParameter('facebookPixelSettings', i) as IDataObject;
						endpoint = `/forms/${formId}/facebook-pixel`;
						method = 'PATCH' as IHttpRequestMethods;

						body = {
							enable_facebook_pixel: fbSettings.enable_facebook_pixel,
						};
						if (fbSettings.facebook_pixel_id) {
							body.facebook_pixel_id = fbSettings.facebook_pixel_id;
						}
						if (fbSettings.enable_facebook_api !== undefined) {
							body.enable_facebook_api = fbSettings.enable_facebook_api;
						}
						if (fbSettings.facebook_api_token) {
							body.facebook_api_token = fbSettings.facebook_api_token;
						}
					} else if (operation === 'updateTiktokPixel') {
						const formId = this.getNodeParameter('formId', i) as number;
						const tiktokSettings = this.getNodeParameter('tiktokPixelSettings', i) as IDataObject;
						endpoint = `/forms/${formId}/tiktok-pixel`;
						method = 'PATCH' as IHttpRequestMethods;

						body = {
							enable_tiktok_pixel: tiktokSettings.enable_tiktok_pixel,
						};
						if (tiktokSettings.tiktok_pixel_id) {
							body.tiktok_pixel_id = tiktokSettings.tiktok_pixel_id;
						}
						if (tiktokSettings.enable_tiktok_api !== undefined) {
							body.enable_tiktok_api = tiktokSettings.enable_tiktok_api;
						}
						if (tiktokSettings.tiktok_api_token) {
							body.tiktok_api_token = tiktokSettings.tiktok_api_token;
						}
					}
				} else if (resource === 'coupon') {
					if (operation === 'list') {
						endpoint = '/coupons';
						method = 'GET' as IHttpRequestMethods;
						const queryOptions = this.getNodeParameter('couponOptions', i, {}) as IDataObject;

						const queryParams = Object.entries(queryOptions)
							.filter(([_, value]) => value !== '' && value !== undefined)
							.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
							.join('&');

						if (queryParams) {
							endpoint += `?${queryParams}`;
						}
					} else if (operation === 'get') {
						const couponId = this.getNodeParameter('couponId', i) as number;
						endpoint = `/coupons/${couponId}`;
						method = 'GET' as IHttpRequestMethods;
					} else if (operation === 'update') {
						const couponId = this.getNodeParameter('couponId', i) as number;
						const updateFields = this.getNodeParameter('couponUpdateFields', i) as IDataObject;

						if (Object.keys(updateFields).length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one update field must be provided', { itemIndex: i });
						}

						endpoint = `/coupons/${couponId}`;
						method = 'PATCH' as IHttpRequestMethods;
						body = updateFields;
					} else if (operation === 'updateStatus') {
						const couponId = this.getNodeParameter('couponId', i) as number;
						const isActive = this.getNodeParameter('couponIsActive', i) as boolean;
						endpoint = `/coupons/${couponId}/status`;
						method = 'PATCH' as IHttpRequestMethods;
						body = {
							is_active: isActive ? '1' : '0',
						};
					}
				}

				const options: IHttpRequestOptions = {
					method,
					url: `${baseUrl}${endpoint}`,
					headers: {
						'Accept': 'application/json',
						'Authorization': `Bearer ${apiToken}`,
					},
					json: true,
				};

				if (method === 'POST' || method === 'PATCH') {
					options.body = body;
					options.headers!['Content-Type'] = 'application/json';
				}

				responseData = await this.helpers.httpRequest(options);

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
					} else if (statusCode === 400) {
						errorMessage = 'Bad request: The request was improperly formatted or contained invalid parameters.';

						if (error.response.data && error.response.data.message) {
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
							resource,
							operation,
						},
					};
					returnData.push(executionErrorData);
					continue;
				}

				throw new NodeApiError(this.getNode(), error, { message: `BCL API Error [${statusCode}]: ${errorMessage}` });
			}
		}

		return [returnData];
	}
}
